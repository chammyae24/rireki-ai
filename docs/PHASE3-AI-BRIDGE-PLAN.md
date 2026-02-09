# Phase 3: AI Bridge & Gap Detection Implementation Plan

## Overview

This Phase focuses on implementing the AI-powered "Gap Hunter" interviewer, PDF parsing capabilities, and Katakana transliteration functionality using Vercel AI SDK with Gemini (via `@ai-sdk/google`), wired through Clerk-based authentication and plan-aware access control (Pro vs Basic/guest with BYO Gemini keys).

---

## Step 1: Vercel AI SDK + Gemini + Auth Setup

### 1.1 Install AI SDK + Auth Dependencies

```bash
npm install ai@latest @ai-sdk/react@latest @ai-sdk/google@latest
npm install @clerk/nextjs@latest
```

### 1.2 Environment Configuration

**File:** `.env.local`

```env
# Gemini (server-side key for Pro users)
GOOGLE_GENERATIVE_AI_API_KEY=your-server-gemini-key

# Clerk (auth and user plans)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Optional: Vercel KV for caching
KV_URL=
KV_REST_API_TOKEN=
```

### 1.3 Auth-Aware Gemini Model Helper

Create a shared helper (e.g. `lib/ai/getGeminiModel.ts`) that each AI route will use:

```typescript
// lib/ai/getGeminiModel.ts
import { google } from '@ai-sdk/google';
import { auth } from '@clerk/nextjs/server';

export function getGeminiModelForRequest(req: Request) {
  const { userId, sessionClaims } = auth();
  const plan = (sessionClaims?.publicMetadata as any)?.plan ?? 'guest';

  const userKey = req.headers.get('x-user-gemini-api-key') ?? undefined;

  // Pro users use server key (no BYO key required)
  if (userId && plan === 'pro') {
    return google('gemini-1.5-pro-latest');
  }

  // Guests / basic users must provide their own Gemini key
  if (!userKey) {
    throw new Error('GEMINI_KEY_REQUIRED');
  }

  return google('gemini-1.5-pro-latest', { apiKey: userKey });
}
```

All AI routes in this phase will:

- Call `getGeminiModelForRequest(req)` to obtain the correct Gemini model instance.
- Catch `GEMINI_KEY_REQUIRED` and return a 401/403 response that the UI can use to prompt for a BYO Gemini key.

---

## Step 2: AI API Routes

### 2.1 Chat Endpoint

**File:** `app/api/chat/route.ts`

```typescript
import { streamText } from 'ai';
import { getGeminiModelForRequest } from '@/lib/ai/getGeminiModel';

export async function POST(req: Request) {
  const { messages, context } = await req.json();

  const systemMessage = {
    role: 'system' as const,
    content: `You are a Japanese resume assistant. Help users fill out their Rirekisho (履歴書) form.

    Current resume context:
    ${JSON.stringify(context, null, 2)}

    Guidelines:
    - Be professional and helpful
    - Ask questions when information is missing
    - Provide suggestions in business Japanese
    - Keep responses concise (2-3 sentences max)
    - When the user provides information, acknowledge it and ask if they want to update their resume`,
  };

  const model = getGeminiModelForRequest(req);

  const result = streamText({
    model,
    messages: [systemMessage, ...messages],
    temperature: 0.7,
    maxTokens: 500,
  });

  return result.toDataStreamResponse();
}
```

### 2.2 Gap Analysis Endpoint

**File:** `app/api/analyze-gaps/route.ts`

```typescript
import { generateObject } from 'ai';
import { z } from 'zod';
import { RirekishoData } from '@/types/resume';
import { getGeminiModelForRequest } from '@/lib/ai/getGeminiModel';

const gapSchema = z.object({
  missingFields: z.array(
    z.object({
      field: z.string(),
      section: z.string(),
      importance: z.enum(['high', 'medium', 'low']),
      question: z.string(),
    })
  ),
  suggestions: z.array(z.string()),
  isComplete: z.boolean(),
});

export async function POST(req: Request) {
  const { resumeData }: { resumeData: RirekishoData } = await req.json();

  const model = getGeminiModelForRequest(req);

  const { object: analysis } = await generateObject({
    model,
    schema: gapSchema,
    prompt: `Analyze this resume data for a Japanese job application and identify missing information.

    Resume Data:
    ${JSON.stringify(resumeData, null, 2)}

    For each visa tier, these fields are critical:
    - ENGINEER: technicalSkills, jlptLevel, motivation.reasonForApplying
    - SSW: sswCertificates, technicalSkills, physicalStats
    - TITP: familyDetails, physicalStats, motivation fields

    Identify:
    1. Any null/empty fields
    2. Fields that should be expanded (too short descriptions)
    3. Missing context for work history

    Return a structured analysis with specific questions to ask the user.`,
  });

  return Response.json(analysis);
}
```

### 2.3 PDF Parsing Endpoint

**File:** `app/api/parse-cv/route.ts`

```typescript
import { generateObject } from 'ai';
import { z } from 'zod';
import pdfParse from 'pdf-parse';
import { getGeminiModelForRequest } from '@/lib/ai/getGeminiModel';

const parsedCVSchema = z.object({
  personalInfo: z.object({
    fullName: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    currentAddress: z.string().optional(),
  }),
  education: z.array(
    z.object({
      schoolName: z.string(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      status: z.enum(['Graduated', 'Dropout']),
    })
  ),
  workHistory: z.array(
    z.object({
      companyName: z.string(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      role: z.string(),
      description: z.string().optional(),
    })
  ),
  skills: z.array(z.string()),
  confidence: z.object({
    personalInfo: z.number().min(0).max(1),
    education: z.number().min(0).max(1),
    workHistory: z.number().min(0).max(1),
    skills: z.number().min(0).max(1),
  }),
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return Response.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Parse PDF content
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdfData = await pdfParse(buffer);
    const extractedText = pdfData.text;

    const model = getGeminiModelForRequest(req);

    // AI parsing
    const { object: parsedData } = await generateObject({
      model,
      schema: parsedCVSchema,
      prompt: `Extract structured resume information from this CV text.

      CV Text:
      """
      ${extractedText}
      """

      Extract:
      1. Personal information (name, email, phone, address)
      2. Education history with dates
      3. Work history with company names, dates, roles, descriptions
      4. Skills and certifications

      Also provide confidence scores (0-1) for each section based on data quality.
      Return in the specified schema format.`,
    });

    return Response.json(parsedData);
  } catch (error) {
    console.error('PDF parsing error:', error);
    return Response.json(
      { error: 'Failed to parse PDF' },
      { status: 500 }
    );
  }
}
```

### 2.4 Katakana Transliteration Endpoint

**File:** `app/api/transliterate/route.ts`

```typescript
import { generateObject } from 'ai';
import { z } from 'zod';
import { getGeminiModelForRequest } from '@/lib/ai/getGeminiModel';

const transliterationSchema = z.object({
  katakana: z.string(),
  pronunciation: z.string(),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  const { name, sourceLanguage }: { name: string; sourceLanguage: string } = await req.json();

  if (!name) {
    return Response.json({ error: 'Name is required' }, { status: 400 });
  }

  const model = getGeminiModelForRequest(req);

  const { object: result } = await generateObject({
    model,
    schema: transliterationSchema,
    prompt: `Transliterate this name from ${sourceLanguage} to Japanese Katakana for a formal job application (履歴書).

    Name: ${name}
    Source Language: ${sourceLanguage}

    Guidelines:
    - Use proper Japanese phonetics suitable for formal documents
    - Apply Hepburn romanization principles adapted to Katakana
    - Use interpuncts (・) between name components
    - Ensure the result sounds natural to Japanese speakers
    - Consider the speaker's likely pronunciation, not just strict letter-by-letter conversion

    Return the katakana, pronunciation guide in romaji, and any important notes about the transliteration.`,
  });

  return Response.json(result);
}
```

---

## Step 3: Gap Hunter UI Component

### 3.1 Chat Sidebar

**File:** `app/builder/_components/GapHunter/GapHunterSidebar.tsx`

```typescript
'use client';

import { useChat } from 'ai/react';
import { useResumeData } from '@/lib/hooks/useResumeData';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, Bot, User } from 'lucide-react';

interface GapAnalysis {
  missingFields: Array<{
    field: string;
    section: string;
    importance: 'high' | 'medium' | 'low';
    question: string;
  }>;
  suggestions: string[];
  isComplete: boolean;
}

export const GapHunterSidebar = () => {
  const { resumeData } = useResumeData();
  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: {
      context: resumeData,
    },
  });
  
  // Analyze gaps on mount
  useEffect(() => {
    analyzeGaps();
  }, []);
  
  const analyzeGaps = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze-gaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData }),
      });
      
      if (response.ok) {
        const analysis = await response.json();
        setGapAnalysis(analysis);
      }
    } catch (error) {
      console.error('Gap analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-50 border-l">
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI Assistant
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={analyzeGaps}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Rescan'
            )}
          </Button>
        </div>
        
        {/* Gap Summary */}
        {gapAnalysis && (
          <div className="mt-3 space-y-2">
            {gapAnalysis.isComplete ? (
              <Badge variant="success">Resume Complete!</Badge>
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  {gapAnalysis.missingFields.length} fields need attention
                </p>
                <div className="flex gap-2">
                  <Badge variant="destructive">
                    {gapAnalysis.missingFields.filter(f => f.importance === 'high').length} High
                  </Badge>
                  <Badge variant="warning">
                    {gapAnalysis.missingFields.filter(f => f.importance === 'medium').length} Medium
                  </Badge>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {/* Welcome message */}
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Bot className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 bg-blue-50 rounded-lg p-3">
              <p className="text-sm">
                Hi! I'm here to help you complete your Japanese resume. 
                I'll scan for missing information and help you fill it in.
              </p>
            </div>
          </div>
          
          {/* Gap highlights */}
          {gapAnalysis?.missingFields.slice(0, 3).map((gap, index) => (
            <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <Badge
                variant={gap.importance === 'high' ? 'destructive' : 'warning'}
                className="mb-2"
              >
                {gap.importance.toUpperCase()}
              </Badge>
              <p className="text-sm font-medium">{gap.section}</p>
              <p className="text-sm text-gray-600 mt-1">{gap.question}</p>
            </div>
          ))}
          
          {/* Chat messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${
                message.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user' 
                  ? 'bg-gray-200' 
                  : 'bg-blue-100'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <div className={`flex-1 rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100'
              }`}>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
              </div>
              <div className="flex-1 bg-gray-100 rounded-lg p-3">
                <p className="text-sm text-gray-500">Thinking...</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about missing fields or provide information..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
```

### 3.2 File Upload Component

**File:** `app/builder/_components/GapHunter/CVUpload.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useResumeData } from '@/lib/hooks/useResumeData';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, File, Check, AlertCircle } from 'lucide-react';

export const CVUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { actions } = useResumeData();
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    setProgress(0);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/parse-cv', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to parse CV');
      }
      
      const parsedData = await response.json();
      
      // Merge parsed data with current resume
      if (parsedData.personalInfo) {
        actions.updatePersonalInfo(parsedData.personalInfo);
      }
      
      if (parsedData.education?.length > 0) {
        parsedData.education.forEach((edu: any) => {
          actions.addEducation(edu);
        });
      }
      
      if (parsedData.workHistory?.length > 0) {
        parsedData.workHistory.forEach((work: any) => {
          actions.addWorkHistory(work);
        });
      }
      
      setUploadStatus('success');
      setProgress(100);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setUploadStatus('idle');
        setProgress(0);
      }, 3000);
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="p-4 border-b bg-white">
      <h4 className="text-sm font-medium mb-2">Upload Existing CV</h4>
      
      <div className="relative">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <Button
          variant="outline"
          className="w-full justify-center"
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : uploadStatus === 'success' ? (
            <Check className="w-4 h-4 mr-2 text-green-600" />
          ) : uploadStatus === 'error' ? (
            <AlertCircle className="w-4 h-4 mr-2 text-red-600" />
          ) : (
            <Upload className="w-4 h-4 mr-2" />
          )}
          
          {isUploading 
            ? 'Parsing...' 
            : uploadStatus === 'success' 
            ? 'CV Parsed!' 
            : uploadStatus === 'error'
            ? 'Try Again'
            : 'Upload PDF or Word'}
        </Button>
      </div>
      
      {progress > 0 && (
        <Progress value={progress} className="mt-2" />
      )}
      
      <p className="text-xs text-gray-500 mt-2">
        Supports PDF, DOC, and DOCX files
      </p>
    </div>
  );
};
```

---

## Step 4: Katakana Name Input

### 4.1 Transliteration Input Component

**File:** `components/forms/KatakanaNameInput.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Wand2 } from 'lucide-react';

export const KatakanaNameInput = () => {
  const { control, watch, setValue } = useFormContext();
  const [isTranslating, setIsTranslating] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  
  const fullName = watch('personalInfo.fullName');
  
  const transliterate = async () => {
    if (!fullName) return;
    
    setIsTranslating(true);
    
    try {
      const response = await fetch('/api/transliterate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          sourceLanguage: detectLanguage(fullName),
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        setSuggestion(result.katakana);
      }
    } catch (error) {
      console.error('Transliteration error:', error);
    } finally {
      setIsTranslating(false);
    }
  };
  
  const acceptSuggestion = () => {
    if (suggestion) {
      setValue('personalInfo.katakanaName', suggestion);
      setSuggestion(null);
    }
  };
  
  const detectLanguage = (name: string): string => {
    // Simple heuristic - in production, use proper detection
    if (/^[\u1000-\u109F]/.test(name)) return 'Myanmar';
    if (/^[\u0041-\u005A\u0061-\u007A]/.test(name)) return 'English';
    if (/^[\u4E00-\u9FFF]/.test(name)) return 'Chinese';
    return 'English';
  };
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Katakana Name (フリガナ)
      </label>
      
      <div className="flex gap-2">
        <Controller
          name="personalInfo.katakanaName"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="e.g., ジョン・ドウ"
              className="flex-1"
            />
          )}
        />
        
        <Button
          type="button"
          variant="outline"
          onClick={transliterate}
          disabled={isTranslating || !fullName}
        >
          {isTranslating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Wand2 className="w-4 h-4" />
          )}
        </Button>
      </div>
      
      {suggestion && (
        <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-md">
          <span className="text-sm">
            Suggestion: <strong>{suggestion}</strong>
          </span>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={acceptSuggestion}
          >
            Use
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setSuggestion(null)}
          >
            Dismiss
          </Button>
        </div>
      )}
      
      <p className="text-xs text-gray-500">
        Enter manually or click the magic wand to auto-convert from your full name
      </p>
    </div>
  );
};
```

---

## Step 5: Builder Page Update

### 5.1 Updated Builder Page

**File:** `app/builder/page.tsx` (updated)

```typescript
'use client';

import { FormProvider } from '@/components/forms/FormProvider';
import { useResumeData } from '@/lib/hooks/useResumeData';
import { StepNavigation } from '@/components/builder/StepNavigation';
import { PDFProvider } from '@/components/pdf/PDFProvider';
import { GapHunterSidebar } from '@/app/builder/_components/GapHunter/GapHunterSidebar';
import { CVUpload } from '@/app/builder/_components/GapHunter/CVUpload';
import { PersonalInfoStep } from '@/components/builder/steps/PersonalInfoStep';
import { EducationStep } from '@/components/builder/steps/EducationStep';
// ... other step imports

const steps = [
  PersonalInfoStep,
  EducationStep,
  // ... other steps
];

export default function BuilderPage() {
  const { resumeData, currentStep } = useResumeData();
  const CurrentStepComponent = steps[currentStep];
  
  return (
    <FormProvider defaultValues={resumeData}>
      <div className="flex h-screen">
        {/* Left Panel - Form */}
        <div className="w-5/12 flex flex-col border-r">
          <div className="p-4 border-b">
            <StepNavigation />
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <CurrentStepComponent />
          </div>
          
          <div className="p-4 border-t bg-gray-50">
            <StepControls />
          </div>
        </div>
        
        {/* Center - Preview */}
        <div className="w-4/12 flex flex-col">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-semibold">Preview</h2>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            <PDFProvider data={resumeData} />
          </div>
        </div>
        
        {/* Right - AI Assistant */}
        <div className="w-3/12 flex flex-col">
          <CVUpload />
          <GapHunterSidebar />
        </div>
      </div>
    </FormProvider>
  );
}
```

---

## Step 6: Testing & Error Handling

### 6.1 AI Integration Tests

**File:** `tests/api/chat.test.ts`

```typescript
describe('Chat API', () => {
  it('should stream AI responses', async () => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'What fields are missing?' }],
        context: { tier: 'ENGINEER' },
      }),
    });
    
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/event-stream');
  });
});

describe('Gap Analysis API', () => {
  it('should identify missing fields', async () => {
    const incompleteResume = {
      tier: 'ENGINEER',
      personalInfo: { fullName: 'John' },
      education: [],
      workHistory: [],
      skills: {},
      motivation: {},
    };
    
    const response = await fetch('/api/analyze-gaps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeData: incompleteResume }),
    });
    
    const analysis = await response.json();
    
    expect(analysis.missingFields).toHaveLength.gt(0);
    expect(analysis.isComplete).toBe(false);
  });
});
```

---

## Verification Checklist

### Code Quality
- [ ] API routes properly typed
- [ ] Error handling implemented
- [ ] Rate limiting considered
- [ ] API keys secured

### Functionality
- [ ] Chat responds correctly
- [ ] Gap analysis identifies issues
- [ ] PDF parsing extracts data
- [ ] Katakana transliteration works

### Performance
- [ ] Streaming responses work smoothly
- [ ] API calls don't block UI
- [ ] Caching implemented where needed

---

## Deliverables for Phase 3

1. **AI API Endpoints**
   - Chat streaming endpoint
   - Gap analysis endpoint
   - PDF parsing endpoint
   - Katakana transliteration endpoint

2. **Gap Hunter UI**
   - Chat sidebar component
   - File upload component
   - Gap highlights
   - Message streaming

3. **Transliteration System**
   - API integration
   - Suggestion UI
   - Language detection

---

## Estimated Timeline

- Step 1 (AI SDK Setup): 4 hours
- Step 2 (API Routes): 12 hours
- Step 3 (Gap Hunter UI): 12 hours
- Step 4 (Transliteration): 6 hours
- Step 5 (Integration): 4 hours
- Step 6 (Testing): 2 hours

**Total: ~40 hours (5 days)**

---

## Next Phase

After completing Phase 3:
1. AI integration is complete
2. Gap detection works
3. Ready for Phase 4: TITP Bio-Data Support
