# Technical PRD: Rireki-ai

**Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Vercel AI SDK (`ai`, `@ai-sdk/react`, `@ai-sdk/google`), Clerk, Gemini (Google AI).

## 1. System Architecture

### 1.1 High-Level Data Flow

1. **Input:** User uploads CV (PDF/Word) Parsed by generic parser (Server-side).
2. **Processing:** Data mapped to `RirekishoSchema`.
3. **Gap Analysis:** AI (Gemini via Vercel AI SDK using `@ai-sdk/google`) scans `RirekishoSchema` for null values and triggers "Interviewer Mode".
4. **Refinement:** User answers in native language AI translates to Business Japanese Updates Schema.
5. **Output:** React component renders visual resume `@react-pdf/renderer` generates binary PDF in browser.

### 1.2 Core Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (Strict mode)
- **State Management:** `Zustand` (for global resume state) + `React Hook Form` (for form validation).
- **Styling:** Tailwind CSS + `shadcn/ui` (for accessible components).
- **PDF Engine:** `@react-pdf/renderer` (Client-side).
- **AI Integration:** Vercel AI SDK (`ai/rsc` or `useChat`) + Gemini provider via `@ai-sdk/google`.
- **Auth & Users:** Clerk (`@clerk/nextjs`) for authentication, sessions, and plan metadata.
- **Type Validation:** `Zod` (essential for structured AI output).

### 1.3 Authentication & Access Model (Gemini Usage)

Rireki-ai uses Clerk for authentication and user plans, with Gemini as the only AI provider:

- **Guest (not logged in):**
  - Can use the builder and PDF preview without AI.
  - To use AI features (Gap Hunter, parsing, transliteration), must supply their own Gemini API key (BYO key) in the UI.
  - The key is kept client-side and sent as a header to AI endpoints only for the current browser; it is never stored in the database.

- **Basic (logged in, non-pro user):**
  - Same AI behavior as Guest (must provide a BYO Gemini key).
  - Clerk user metadata (e.g. `publicMetadata.plan = "basic"`) is used to enforce this on the server.

- **Pro (logged in, paid user):**
  - AI features use the app’s server-side Gemini API key (`GOOGLE_GENERATIVE_AI_API_KEY`) and do not require a BYO key.
  - Rate limits and quotas are enforced per user using Clerk user IDs and metadata.

All AI endpoints (`/api/chat`, `/api/analyze-gaps`, `/api/parse-cv`, `/api/transliterate`) implement this logic:

- If Clerk session exists and `plan === "pro"` → use server Gemini key.
- Otherwise → require a Gemini key in the request (e.g. `x-user-gemini-api-key` header) and configure `@ai-sdk/google` with that key.

---

## 2. Feature Specifications & Technical Implementation

### 2.1 The "Gap Hunter" (AI Interviewer)

- **UX:** A split screen. Left side = Live Resume Preview. Right side = Chatbot.
- **Tech Implementation:**
  - Implement `/api/chat` using Vercel AI SDK with the Gemini provider (`@ai-sdk/google`), streaming responses to the UI.
  - For Pro users (Clerk `plan: "pro"`), configure the model as `google('gemini-1.5-pro-latest')` using the server-side `GOOGLE_GENERATIVE_AI_API_KEY`.
  - For Guest/Basic users, read a BYO Gemini key from the request (e.g. `x-user-gemini-api-key` header) and pass it into `google('gemini-1.5-pro-latest', { apiKey: userKey })`.
  - Use the `generateObject` function from Vercel AI SDK for structured JSON updates (e.g. patching `RirekishoData`) rather than free-form text.
- **Prompt Strategy:** "You are a strict Japanese recruiter. The user is applying for. Review the current JSON data. If the 'Reason for Application' is missing, ask them why they want to apply. Return their answer as valid Japanese JSON."

### 2.2 Japanese Font Handling (Critical Path)

- **Challenge:** Standard PDF fonts (Helvetica) do not support Kanji. You will see empty squares ("tofu") if you don't load a custom font.
- **Solution:**

1. Download **Google Noto Sans JP** (Regular and Bold).
2. Place `.ttf` files in `public/fonts/`.
3. Register in the React-PDF component:

```typescript
import { Font } from '@react-pdf/renderer';

Font.register({
  family: 'NotoSansJP',
  fonts:
});

```

### 2.3 Name Transliteration (Katakana Converter)

- **Challenge:** Japanese forms require a "Furigana" (Katakana reading) of the name.
- **Library:** Do _not_ use simple dictionary lookups like `wanakana` for names, as they often fail on Burmese names.
- **AI Fallback:** Use a specific AI call on the `onBlur` event of the Name input.
- _Input:_ "Aung Kyaw Soe"
- _Prompt:_ "Transliterate this Myanmar name to Japanese Katakana for a formal document. Return only the string."
- _Output:_ "アウン・チョー・ソー"

---

## 3. Data Schema (TypeScript)

This schema handles the complexity of the three different tiers (TITP, SSW, Engineer).

```typescript
// types/resume.ts

export type VisaTier = "TITP" | "SSW" | "ENGINEER";

export interface RirekishoData {
  tier: VisaTier;
  personalInfo: {
    fullName: string;
    katakanaName: string; // Critical for Japan
    gender: "Male" | "Female";
    birthDate: string; // ISO format
    currentAddress: string;
    japanAddress?: string; // Optional
    email: string;
    phone: string;
    photoUrl?: string; // Base64 or Blob URL
    // Specific to TITP/Bio-Data
    familyDetails?: {
      name: string;
      relationship: string;
      age: number;
      occupation: string;
    };
    // Specific to SSW/TITP physical work
    physicalStats?: {
      heightCm: number;
      weightKg: number;
      bloodType?: string;
      handz: "Right" | "Left";
    };
  };
  education: {
    schoolName: string;
    startDate: string;
    endDate: string;
    status: "Graduated" | "Dropout";
  };
  workHistory: {
    companyName: string;
    startDate: string;
    endDate: string | "Current";
    role: string;
    description?: string; // For Engineer Shokumu Keirekisho
  };
  skills: {
    jlptLevel?: "N1" | "N2" | "N3" | "N4" | "N5" | "None";
    sswCertificates?: string; // e.g., "Care Worker", "Food Service"
    technicalSkills?: string; // e.g., "Excavator Driving", "Java"
  };
  motivation: {
    reasonForApplying: string; // The "Shibou Douki"
    selfPR: string; // "Jiko PR"
  };
}
```

---

## 4. Page Structure (Next.js App Router)

app/
├── api/
│ ├── parse-cv/ # Endpoint to parse initial PDF upload
│ ├── chat/ # Endpoint for AI Interviewer (streamText)
│ └── transliterate/ # Endpoint for Name -> Katakana
├── builder/
│ ├── page.tsx # Main wizard container
│ ├── \_components/
│ │ ├── FormSteps/ # Step 1: Info, Step 2: Work, etc.
│ │ ├── LivePreview/ # Shows the React-PDF preview
│ │ └── GapHunter/ # The AI chat sidebar
├── layout.tsx
└── page.tsx # Landing page

## 5. Implementation Roadmap

### Phase 1: The Static Generator

1. Set up Next.js + Tailwind.
2. Create the `RirekishoDocument` component using `@react-pdf/renderer`.
3. Implement the grid layout (JIS Standard) using React-PDF's `<View>` and `<Text>` primitives.

- _Note:_ You cannot use CSS Grid/Flexbox freely in React-PDF; you must use their specific Flexbox implementation.

4. Test Japanese font rendering locally.

### Phase 2: The Logic Layer

1. Implement `react-hook-form` to bind inputs to the `RirekishoData` state.
2. Add the "Japanese Year Converter" utility (e.g., converting 2024 to Reiwa 6), as Japanese forms often require Imperial dates.

### Phase 3: The AI Bridge

1. Create the `/api/chat` route using Vercel AI SDK.
2. Build the "Gap Hunter" logic:

- When user clicks "Fix with AI" on an empty field, send the surrounding context to the API.
- Stream the response back into the text field.

### Phase 4: TITP Bio-Data Support

1. Create a secondary PDF template `BioDataDocument`.
2. This template looks different (list style, not grid style) and includes the Family/Health sections required for trainees.
