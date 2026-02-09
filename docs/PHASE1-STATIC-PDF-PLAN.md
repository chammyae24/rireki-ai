# Phase 1: Static PDF Generator Implementation Plan

## Overview

This Phase focuses on creating the core Rirekisho PDF template with Japanese font integration and JIS-standard layout. No AI or complex logic will be added yet.

---

## Step 1: Project Setup

### 1.1 Create Project Structure

```bash
mkdir -p app/api
mkdir -p app/builder/_components
mkdir -p components/pdf
mkdir -p lib/fonts
mkdir -p types
```

### 1.2 Install Dependencies

```bash
npm install @react-pdf/renderer @react-pdf/types
npm install tailwindcss @radix-ui/react-slot
npm install zustand react-hook-form
npm install zod
```

### 1.3 Download Japanese Fonts

**Download Noto Sans JP fonts:**
1. Visit https://fonts.google.com/noto/specimen/Noto+Sans+JP
2. Download Regular (400) and Bold (700) weights
3. Place `.ttf` files in `public/fonts/`

---

## Step 2: Font Registration System

### 2.1 Create Font Registry

**File:** `lib/fonts/registry.ts`

```typescript
import { Font } from '@react-pdf/renderer';

const registerFonts = async () => {
  const fonts = [
    {
      family: 'NotoSansJP',
      fonts: [
        {
          src: '/fonts/NotoSansJP-Regular.ttf',
          fontWeight: 400,
        },
        {
          src: '/fonts/NotoSansJP-Bold.ttf',
          fontWeight: 700,
        },
      ],
    },
  ];
  
  fonts.forEach(font => {
    Font.register(font);
  });
};

export { registerFonts };
```

### 2.2 Create Font Helper Functions

**File:** `lib/fonts/helpers.ts`

```typescript
export const getJapaneseFont = (weight: number = 400) => {
  return 'NotoSansJP';
};

export const convertToJapaneseDate = (date: Date): string => {
  // Convert Western date to Japanese Imperial era format
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Simplified conversion (for Reiwa era)
  const reiwaYear = year - 2018;
  return `令和${reiwaYear}年${month}月${day}日`;
};
```

---

## Step 3: Core Type Definitions

### 3.1 Create Resume Types

**File:** `types/resume.ts`

```typescript
export type VisaTier = "TITP" | "SSW" | "ENGINEER";

export interface RirekishoData {
  tier: VisaTier;
  personalInfo: {
    fullName: string;
    katakanaName: string;
    gender: "Male" | "Female";
    birthDate: string;
    currentAddress: string;
    japanAddress?: string;
    email: string;
    phone: string;
    photoUrl?: string;
  };
  education: {
    schoolName: string;
    startDate: string;
    endDate: string;
    status: "Graduated" | "Dropout";
  }[];
  workHistory: {
    companyName: string;
    startDate: string;
    endDate: string | "Current";
    role: string;
    description?: string;
  }[];
  skills: {
    jlptLevel?: "N1" | "N2" | "N3" | "N4" | "N5" | "None";
    sswCertificates?: string[];
    technicalSkills?: string[];
  };
  motivation: {
    reasonForApplying: string;
    selfPR: string;
  };
}
```

### 3.2 Create Zod Schemas

**File:** `lib/schemas/resume.ts`

```typescript
import { z } from 'zod';

export const resumeSchema = z.object({
  tier: z.enum(["TITP", "SSW", "ENGINEER"]),
  personalInfo: z.object({
    fullName: z.string().min(1, "Name is required"),
    katakanaName: z.string().min(1, "Katakana name is required"),
    gender: z.enum(["Male", "Female"]),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
    currentAddress: z.string().min(1, "Address is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(1, "Phone is required"),
  }),
  // ... more schema definitions
});
```

---

## Step 4: PDF Template Components

### 4.1 Main Rirekisho Document

**File:** `components/pdf/RirekishoDocument.tsx`

```typescript
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { RirekishoData } from '@/types/resume';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'NotoSansJP',
    padding: 30,
    fontSize: 10,
  },
  section: {
    marginBottom: 10,
    borderBottom: '1 solid #000',
    paddingBottom: 5,
  },
  header: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  field: {
    width: '50%',
    marginBottom: 5,
  },
  label: {
    fontSize: 8,
    color: '#666',
  },
  value: {
    fontSize: 10,
  },
});

interface RirekishoDocumentProps {
  data: RirekishoData;
}

export const RirekishoDocument = ({ data }: RirekishoDocumentProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={styles.header}>Personal Information</Text>
          <View style={styles.grid}>
            <View style={styles.field}>
              <Text style={styles.label}>氏名 (Name)</Text>
              <Text style={styles.value}>{data.personalInfo.fullName}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>フリガナ (Katakana)</Text>
              <Text style={styles.value}>{data.personalInfo.katakanaName}</Text>
            </View>
            {/* ... more fields */}
          </View>
        </View>
        
        {/* Education Section */}
        <View style={styles.section}>
          <Text style={styles.header}>Education</Text>
          {data.education.map((edu, index) => (
            <View key={index} style={styles.field}>
              <Text>{edu.schoolName} ({edu.startDate} - {edu.endDate})</Text>
            </View>
          ))}
        </View>
        
        {/* Work History Section */}
        <View style={styles.section}>
          <Text style={styles.header}>Work History</Text>
          {data.workHistory.map((work, index) => (
            <View key={index} style={styles.field}>
              <Text>{work.companyName} - {work.role}</Text>
              <Text>{work.startDate} - {work.endDate}</Text>
            </View>
          ))}
        </View>
        
        {/* Skills Section */}
        <View style={styles.section}>
          <Text style={styles.header}>Skills</Text>
          <Text>JLPT Level: {data.skills.jlptLevel || 'None'}</Text>
          {data.skills.technicalSkills && (
            <Text>Technical Skills: {data.skills.technicalSkills.join(', ')}</Text>
          )}
        </View>
        
        {/* Motivation Section */}
        <View style={styles.section}>
          <Text style={styles.header}>Motivation</Text>
          <Text>Reason for Applying: {data.motivation.reasonForApplying}</Text>
          <Text>Self-PR: {data.motivation.selfPR}</Text>
        </View>
      </Page>
    </Document>
  );
};
```

### 4.2 PDF Provider Component

**File:** `components/pdf/PDFProvider.tsx`

```typescript
'use client';

import { PDFViewer } from '@react-pdf/renderer';
import { RirekishoDocument } from './RirekishoDocument';
import { RirekishoData } from '@/types/resume';

interface PDFProviderProps {
  data: RirekishoData;
}

export const PDFProvider = ({ data }: PDFProviderProps) => {
  return (
    <div className="w-full h-full border rounded-lg">
      <PDFViewer width="100%" height="100%">
        <RirekishoDocument data={data} />
      </PDFViewer>
    </div>
  );
};
```

---

## Step 5: Basic UI Components

### 5.1 Main Builder Page

**File:** `app/builder/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { PDFProvider } from '@/components/pdf/PDFProvider';
import { RirekishoData } from '@/types/resume';

const initialData: RirekishoData = {
  tier: "ENGINEER",
  personalInfo: {
    fullName: "",
    katakanaName: "",
    gender: "Male",
    birthDate: "",
    currentAddress: "",
    email: "",
    phone: "",
  },
  education: [],
  workHistory: [],
  skills: {},
  motivation: {
    reasonForApplying: "",
    selfPR: "",
  },
};

export default function BuilderPage() {
  const [data, setData] = useState<RirekishoData>(initialData);
  
  return (
    <div className="flex h-screen">
      <div className="w-1/2 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Resume Builder</h1>
        {/* Form components will be added in Phase 2 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded"
              value={data.personalInfo.fullName}
              onChange={(e) => setData(prev => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, fullName: e.target.value }
              }))}
            />
          </div>
          {/* More form fields */}
        </div>
      </div>
      
      <div className="w-1/2 border-l">
        <PDFProvider data={data} />
      </div>
    </div>
  );
}
```

---

## Step 6: Testing & Verification

### 6.1 Create Test Data

**File:** `lib/test-data.ts`

```typescript
import { RirekishoData } from '@/types/resume';

export const sampleData: RirekishoData = {
  tier: "ENGINEER",
  personalInfo: {
    fullName: "John Doe",
    katakanaName: "ジョン・ドウ",
    gender: "Male",
    birthDate: "1990-01-01",
    currentAddress: "123 Main St, Tokyo, Japan",
    email: "john.doe@example.com",
    phone: "+81-3-1234-5678",
  },
  education: [
    {
      schoolName: "Tokyo University",
      startDate: "2008-04-01",
      endDate: "2012-03-31",
      status: "Graduated",
    },
  ],
  workHistory: [
    {
      companyName: "Tech Corp Inc.",
      startDate: "2012-04-01",
      endDate: "Current",
      role: "Software Engineer",
      description: "Developed web applications using React and Node.js",
    },
  ],
  skills: {
    jlptLevel: "N2",
    technicalSkills: ["JavaScript", "TypeScript", "React", "Node.js"],
  },
  motivation: {
    reasonForApplying: "To contribute to innovative projects in Japan",
    selfPR: "Experienced developer with strong problem-solving skills",
  },
};
```

### 6.2 Manual Testing Checklist

- [ ] PDF renders without errors
- [ ] Japanese characters display correctly
- [ ] Layout matches JIS standards
- [ ] Font weights (Regular/Bold) work
- [ ] Page breaks correctly
- [ ] Cross-browser compatibility

---

## Verification Checklist

### Code Quality
- [ ] TypeScript strict mode enabled
- [ ] No `any` types used
- [ ] Clear component structure
- [ ] Font loading works correctly

### Functionality
- [ ] PDF generation successful
- [ ] Font rendering correct
- [ ] Basic layout acceptable
- [ ] Sample data displays properly

### Performance
- [ ] PDF loads within 3 seconds
- [ ] No memory leaks
- [ ] Responsive to state changes

---

## Deliverables for Phase 1

1. **PDF Generation System**
   - Font registration and loading
   - Basic Rirekisho template
   - Japanese character support

2. **Type Definitions**
   - Complete TypeScript interfaces
   - Zod validation schemas

3. **Basic UI**
   - Split-screen layout
   - Simple form inputs
   - Live PDF preview

---

## Estimated Timeline

- Step 1 (Setup): 4 hours
- Step 2 (Font Registration): 3 hours
- Step 3 (Type Definitions): 4 hours
- Step 4 (PDF Components): 10 hours
- Step 5 (UI Components): 5 hours
- Step 6 (Testing): 4 hours

**Total: ~30 hours (4 days)**

---

## Next Phase

After completing Phase 1:
1. PDF template is functional
2. Japanese fonts are integrated
3. Ready for Phase 2: Logic Layer & Data Binding