# Master Implementation Plan - Rireki-ai

## Project Overview

**Rireki-ai** is a Next.js application that converts international CVs to Japanese-style Rirekisho (resume) documents with AI-powered assistance.

**Key Features:**
- PDF upload parsing and data extraction
- AI "Gap Hunter" interviewer mode for missing information
- Japanese name transliteration to Katakana
- Custom PDF generation with Japanese fonts
- Support for TITP, SSW, and Engineer visa tiers
- Authentication & plans with Gemini usage:
  - Logged-out or **Basic** users: must provide their own Gemini API key (BYO key) to use AI features.
  - **Pro** users: AI requests use a server-side Gemini API key managed by the app.

**Tech Stack:**
- Next.js 14+ (App Router)
- TypeScript (strict mode)
- Tailwind CSS + shadcn/ui
- AI: Gemini models via Vercel AI SDK (`ai`, `@ai-sdk/react`, `@ai-sdk/google`)
- Auth: Clerk for authentication and user plans
- @react-pdf/renderer
- Zustand + React Hook Form for state and forms

---

## Implementation Phases

The project is divided into **4 sequential phases**, each building upon the previous:

| Phase       | Focus                        | Duration                   | Status     |
| ----------- | ---------------------------- | -------------------------- | ---------- |
| **Phase 1** | Static PDF Generator         | 30 hours (4 days)          | ⏳ Pending |
| **Phase 2** | Logic Layer & Data Binding   | 35 hours (4-5 days)        | ⏳ Pending |
| **Phase 3** | AI Bridge & Gap Detection    | 40 hours (5 days)          | ⏳ Pending |
| **Phase 4** | TITP Bio-Data Support        | 35 hours (4-5 days)        | ⏳ Pending |
| **Total**   |                              | **140 hours (17-19 days)** |            |

---

## Phase 1: Static PDF Generator

**Goal:** Create the core Rirekisho PDF template with Japanese fonts and JIS-standard layout.

### Key Components:

1. **RirekishoDocument.tsx** - Main PDF component
   - JIS-standard grid layout implementation
   - Japanese font handling (Noto Sans JP)
   - Support for all visa tiers

2. **Layout Components**
   - Section headers and formatting
   - Date formatting (Japanese Imperial calendar)
   - Field labels in Japanese/English

3. **Font Integration**
   - Noto Sans JP font registration
   - Font weight handling (Regular/Bold)
   - Cross-platform font rendering

### Deliverables:
- ✓ Complete Rirekisho PDF template
- ✓ Japanese font integration
- ✓ Basic layout testing
- ✓ Cross-browser compatibility

### Success Criteria:
- PDF generates without errors
- Japanese characters display correctly
- Layout matches JIS standards
- Fonts load properly

---

## Phase 2: Logic Layer & Data Binding

**Goal:** Implement state management, form validation, and data binding layer.

### Key Components:

1. **Zustand Store** (`resumeStore.ts`)
   - Complete resume state management
   - Actions for form updates
   - Multi-step form progression

2. **React Hook Form Integration**
   - Form validation with Zod schemas
   - Error state management
   - Auto-save functionality

3. **Type Definitions** (`types/resume.ts`)
   - RirekishoData interface
   - Visa tier-specific fields
   - Form validation schemas

4. **Utility Functions**
   - Date conversion (Western to Japanese Imperial)
   - Data transformation utilities
   - Validation helpers

### Deliverables:
- ✓ Zustand store implementation
- ✓ React Hook Form integration
- ✓ TypeScript interfaces
- ✓ Utility functions

### Success Criteria:
- Form state persists correctly
- Validation errors display properly
- Auto-save works reliably
- Type safety maintained

---

## Phase 3: AI Bridge & Gap Detection

**Goal:** Implement AI-powered "Gap Hunter" interviewer and PDF parsing capabilities, wired through Clerk-based auth and Gemini models with plan-aware access control.

### Key Components:

1. **Gemini AI Integration (via Vercel AI SDK)**
   - Install and configure `@ai-sdk/google` with `GOOGLE_GENERATIVE_AI_API_KEY`.
   - `/api/chat` endpoint for AI interviewer using Gemini (e.g. `google('gemini-1.5-pro-latest')`).
   - `/api/analyze-gaps`, `/api/parse-cv`, `/api/transliterate` endpoints use Gemini via `generateObject` where structured output is needed.
   - Implement plan-aware model configuration:
     - Pro users (Clerk `plan: 'pro'`): use server-side Gemini API key.
     - Logged-out or basic-plan users: require a per-request Gemini API key supplied by the user (BYO key) and never stored server-side.

2. **PDF Parsing API**
   - `/api/parse-cv` endpoint for CV uploads
   - PDF text extraction
   - Data mapping to RirekishoSchema

3. **Katakana Transliterator**
   - `/api/transliterate` endpoint
   - AI-powered name transliteration
   - Fallback strategies

4. **Gap Hunter UI Component**
   - Split-screen layout (Resume preview + Chat)
   - Interactive chat interface
   - Field highlighting for missing data
   - UI for entering and validating a user-provided Gemini API key when required (guest/basic users), stored only in local state/storage and passed to the server via secure headers.

5. **Auth & Access Control (Clerk)**
   - Integrate Clerk for authentication on the builder and AI endpoints.
   - Define user plans (`guest`, `basic`, `pro`) via Clerk metadata.
   - Middleware and server-side checks to:
     - Allow unauthenticated access to non-AI features.
     - Gate AI routes so that:
       - Pro users are auto-authorized via server key.
       - Other users must include a valid Gemini API key with each request.

### Deliverables:
- ✓ AI chat API endpoints
- ✓ PDF parsing functionality
- ✓ Katakana transliteration
- ✓ Gap Hunter UI component

### Success Criteria:
- AI successfully detects missing fields
- Chat responses are relevant and helpful
- PDF parsing extracts structured data
- Transliteration is accurate

---

## Phase 4: TITP Bio-Data Support

**Goal:** Add support for TITP-specific Bio-Data forms and additional visa tiers.

### Key Components:

1. **BioDataDocument.tsx**
   - Separate template for TITP Bio-Data
   - List-style layout (vs. grid)
   - Family details and health sections

2. **Visa Tier Logic**
   - Dynamic field rendering based on visa type
   - Tier-specific validation rules
   - Template switching logic

3. **Additional Features**
   - Photo upload and handling
   - Multi-language support
   - Export options

4. **Performance Optimization**
   - PDF generation optimization
   - Caching strategies
   - Bundle size optimization

### Deliverables:
- ✓ Bio-Data PDF template
- ✓ Visa tier-specific logic
- ✓ Photo upload functionality
- ✓ Performance optimizations

### Success Criteria:
- All visa tiers supported
- Bio-Data template matches requirements
- Performance meets production standards
- Cross-platform compatibility maintained

---

## Implementation Order

### Week 1: Phase 1 (Static PDF Generator)
- Days 1-2: Setup Next.js, install dependencies
- Days 3-4: Implement PDF template with Japanese fonts
- Day 5: Testing and font verification

### Week 2: Phase 2 (Logic Layer)
- Days 1-2: Zustand store and type definitions
- Days 3-4: React Hook Form integration
- Day 5: Utility functions and testing

### Week 3: Phase 3 (AI Bridge)
- Days 1-2: Gemini AI integration (Vercel AI SDK + `@ai-sdk/google`) and Clerk auth wiring
- Days 3-4: PDF parsing and gap detection (Gemini-backed)
- Day 5: Katakana transliteration testing and BYO-key UX polish

### Week 4: Phase 4 (Bio-Data Support)
- Days 1-2: Bio-Data template implementation
- Days 3-4: Visa tier logic and photo handling
- Day 5: Performance optimization and testing

### Week 5: Final Polish & Launch
- Days 1-2: End-to-end testing
- Days 3-4: Bug fixes and refinements
- Day 5: Deployment preparation

---

## Dependencies & Prerequisites

### Development Environment

- [ ] Node.js 18+
- [ ] npm or bun
- [ ] Git
- [ ] Code editor (VS Code recommended)

### Required Packages

```json
{
  "core": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "typescript": "^5.0.0"
  },
  "styling": {
    "tailwindcss": "^3.3.0",
    "@radix-ui/react-*": "latest"
  },
  "pdf": {
    "@react-pdf/renderer": "^3.0.0",
    "@react-pdf/types": "^2.0.0"
  },
  "ai": {
    "ai": "^2.8.0",
    "@ai-sdk/react": "^2.8.0"
  },
  "state": {
    "zustand": "^4.4.0",
    "react-hook-form": "^7.47.0"
  }
}
```

### External Services

- **Google Fonts** - Noto Sans JP fonts
- **Gemini (Google AI)** - Primary AI provider via Vercel AI SDK (`@ai-sdk/google`)
- **Clerk** - Authentication and user management (plans, sessions)
- **Vercel** - Deployment platform (optional)

---

## Testing Strategy

### Test Coverage

| Component          | Test Type         | Coverage Goal | Status     |
| ------------------ | ----------------- | ------------- | ---------- |
| PDF Generation     | Unit Tests        | 85%           | ⏳ Pending |
| Form Validation    | Unit Tests        | 90%           | ⏳ Pending |
| AI Integration     | Integration Tests | 80%           | ⏳ Pending |
| PDF Parsing        | Integration Tests | 85%           | ⏳ Pending |
| Transliteration    | Unit Tests        | 90%           | ⏳ Pending |
| Overall            |                   | ≥85%          | ⏳ Pending |

### Key Test Cases

- ✓ PDF generation with Japanese characters
- ✓ Form validation rejects invalid data
- ✓ AI correctly identifies missing fields
- ✓ Name transliteration produces accurate katakana
- ✓ All visa tiers generate correct PDF formats
- ✓ Photo upload handles various file types
- ✓ Auto-save preserves form state
- ✓ Cross-browser compatibility maintained

---

## Milestones & Sign-Off

### Phase 1 Sign-Off Criteria
- [ ] PDF template renders correctly
- [ ] Japanese fonts display properly
- [ ] Layout matches JIS standards
- [ ] Cross-browser compatibility verified

### Phase 2 Sign-Off Criteria
- [ ] Zustand store manages state correctly
- [ ] Form validation works reliably
- [ ] Auto-save functionality implemented
- [ ] Utility functions tested

### Phase 3 Sign-Off Criteria
- [ ] AI chat interface functional
- [ ] PDF parsing extracts structured data
- [ ] Katakana transliteration accurate
- [ ] Gap detection identifies missing fields

### Phase 4 Sign-Off Criteria
- [ ] Bio-Data template implemented
- [ ] All visa tiers supported
- [ ] Photo upload working
- [ ] Performance optimized

---

## Risk Mitigation

### High-Risk Areas

1. **Japanese Font Rendering**
   - **Risk**: Fonts don't render correctly in PDF
   - **Mitigation**: Extensive browser testing, fallback fonts

2. **AI Service Reliability**
   - **Risk**: AI service outages or rate limits
   - **Mitigation**: Graceful degradation, caching strategies

3. **PDF Performance**
   - **Risk**: Slow PDF generation on mobile devices
   - **Mitigation**: Optimized rendering, loading states

### Contingency Plans

- If font rendering fails: Provide download option with instructions
- If AI service unavailable: Fallback to manual input
- If PDF generation slow: Implement progress indicators

---

## Success Metrics

### Technical Metrics

- [ ] <2 second PDF generation
- [ ] <1 second AI response time
- [ ] 99% uptime for AI services
- [ ] <5mb bundle size
- [ ] 0 crashes in testing

### User Experience Metrics (Post-Launch)

- [ ] >90% form completion rate
- [ ] <30 second average resume generation
- [ ] >4/5 star rating
- [ ] >70% user retention

---

## Resources & References

### Documentation

- Phase 1 Details: `docs/PHASE1-STATIC-PDF-PLAN.md`
- Phase 2 Details: `docs/PHASE2-LOGIC-LAYER-PLAN.md`
- Phase 3 Details: `docs/PHASE3-AI-BRIDGE-PLAN.md`
- Phase 4 Details: `docs/PHASE4-BIO-DATA-PLAN.md`
- Product Requirements: `docs/PRD.md`

### External References

- Next.js: https://nextjs.org/docs
- React-PDF: https://react-pdf.org/
- Vercel AI SDK: https://sdk.vercel.ai/docs
- Japanese PDF Standards: https://www.jisc.go.jp/

---

## Next Steps

1. **Setup Development Environment**

   ```bash
   # Verify tools
   node --version  # Should be 18+
   npm --version   # Should be 8+
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Start Phase 1**
   - Create project structure
   - Install React-PDF dependencies
   - Implement basic PDF template
   - Test font rendering

4. **Track Progress**
   - Update this document with completed items
   - Mark milestones as complete
   - Log blockers and resolutions

---

## Contact & Support

For questions or blockers during implementation:

1. Review detailed phase plans
2. Check PRD for specifications
3. Consult external documentation links
4. Log issue with detailed reproduction steps

---

**Version:** 1.0
**Last Updated:** 2026-02-09
**Status:** Planning Complete - Ready to Start Phase 1