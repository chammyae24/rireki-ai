# Phase 2: Logic Layer & Data Binding Implementation Plan

## Overview

This Phase focuses on implementing state management with Zustand, form validation with React Hook Form, and integrating the complete data binding layer between the UI and PDF generation.

---

## Step 1: Zustand Store Implementation

### 1.1 Create Store Structure

**File:** `lib/store/resumeStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RirekishoData, VisaTier } from '@/types/resume';

interface ResumeState {
  data: RirekishoData;
  currentStep: number;
  isLoading: boolean;
  errors: Record<string, string[]>;
  
  // Actions
  setData: (data: Partial<RirekishoData>) => void;
  updatePersonalInfo: (info: Partial<RirekishoData['personalInfo']>) => void;
  addEducation: (edu: RirekishoData['education'][0]) => void;
  updateEducation: (index: number, edu: Partial<RirekishoData['education'][0]>) => void;
  removeEducation: (index: number) => void;
  addWorkHistory: (work: RirekishoData['workHistory'][0]) => void;
  updateWorkHistory: (index: number, work: Partial<RirekishoData['workHistory'][0]>) => void;
  removeWorkHistory: (index: number) => void;
  updateSkills: (skills: Partial<RirekishoData['skills']>) => void;
  updateMotivation: (motivation: Partial<RirekishoData['motivation']>) => void;
  setTier: (tier: VisaTier) => void;
  setCurrentStep: (step: number) => void;
  setErrors: (errors: Record<string, string[]>) => void;
  clearErrors: () => void;
  reset: () => void;
}

const initialState: RirekishoData = {
  tier: "ENGINEER",
  personalInfo: {
    fullName: "",
    katakanaName: "",
    gender: "Male",
    birthDate: "",
    currentAddress: "",
    japanAddress: "",
    email: "",
    phone: "",
    photoUrl: "",
  },
  education: [],
  workHistory: [],
  skills: {},
  motivation: {
    reasonForApplying: "",
    selfPR: "",
  },
};

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      data: initialState,
      currentStep: 0,
      isLoading: false,
      errors: {},
      
      setData: (newData) => set(state => ({ 
        data: { ...state.data, ...newData } 
      })),
      
      updatePersonalInfo: (info) => set(state => ({
        data: { 
          ...state.data, 
          personalInfo: { ...state.data.personalInfo, ...info } 
        }
      })),
      
      addEducation: (edu) => set(state => ({
        data: { 
          ...state.data, 
          education: [...state.data.education, edu] 
        }
      })),
      
      updateEducation: (index, edu) => set(state => {
        const education = [...state.data.education];
        education[index] = { ...education[index], ...edu };
        return { data: { ...state.data, education } };
      }),
      
      removeEducation: (index) => set(state => ({
        data: { 
          ...state.data, 
          education: state.data.education.filter((_, i) => i !== index) 
        }
      })),
      
      addWorkHistory: (work) => set(state => ({
        data: { 
          ...state.data, 
          workHistory: [...state.data.workHistory, work] 
        }
      })),
      
      // Similar implementations for other actions...
      
      setTier: (tier) => set(state => ({ 
        data: { ...state.data, tier } 
      })),
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      setErrors: (errors) => set({ errors }),
      
      clearErrors: () => set({ errors: {} }),
      
      reset: () => set({ data: initialState, currentStep: 0, errors: {} }),
    }),
    {
      name: 'resume-storage',
    }
  )
);
```

### 1.2 Store Hooks

**File:** `lib/hooks/useResumeData.ts`

```typescript
import { useResumeStore } from '@/lib/store/resumeStore';

export const useResumeData = () => {
  const {
    data,
    currentStep,
    errors,
    updatePersonalInfo,
    addEducation,
    updateEducation,
    removeEducation,
    addWorkHistory,
    updateWorkHistory,
    removeWorkHistory,
    updateSkills,
    updateMotivation,
    setTier,
    setCurrentStep,
    setErrors,
    clearErrors,
    reset,
  } = useResumeStore();
  
  return {
    resumeData: data,
    currentStep,
    errors,
    actions: {
      updatePersonalInfo,
      addEducation,
      updateEducation,
      removeEducation,
      addWorkHistory,
      updateWorkHistory,
      removeWorkHistory,
      updateSkills,
      updateMotivation,
      setTier,
      setCurrentStep,
      setErrors,
      clearErrors,
      reset,
    },
  };
};
```

---

## Step 2: React Hook Form Integration

### 2.1 Form Context Provider

**File:** `components/forms/FormProvider.tsx`

```typescript
'use client';

import { FormProvider as HookFormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resumeSchema } from '@/lib/schemas/resume';
import { RirekishoData } from '@/types/resume';

interface FormProviderProps {
  children: React.ReactNode;
  defaultValues?: Partial<RirekishoData>;
}

export const FormProvider = ({ children, defaultValues }: FormProviderProps) => {
  const methods = useForm<RirekishoData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: defaultValues as RirekishoData,
    mode: 'onChange',
  });
  
  return (
    <HookFormProvider {...methods}>
      {children}
    </HookFormProvider>
  );
};
```

### 2.2 Custom Form Components

**File:** `components/forms/ControlledInput.tsx`

```typescript
import { useFormContext } from 'react-hook-form';

interface ControlledInputProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

export const ControlledInput = ({
  name,
  label,
  type = "text",
  placeholder,
  required = false,
}: ControlledInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  
  const error = errors[name];
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        type={type}
        {...register(name)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md shadow-sm ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && (
        <p className="text-sm text-red-600">{error.message as string}</p>
      )}
    </div>
  );
};
```

**File:** `components/forms/DateInput.tsx`

```typescript
import { useFormContext } from 'react-hook-form';

interface DateInputProps {
  name: string;
  label: string;
  required?: boolean;
}

export const DateInput = ({ name, label, required = false }: DateInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  
  const error = errors[name];
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        type="date"
        {...register(name)}
        className={`w-full px-3 py-2 border rounded-md shadow-sm ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && (
        <p className="text-sm text-red-600">{error.message as string}</p>
      )}
    </div>
  );
};
```

---

## Step 3: Step-based Form System

### 3.1 Step Navigation Component

**File:** `components/builder/StepNavigation.tsx`

```typescript
'use client';

import { useResumeData } from '@/lib/hooks/useResumeData';

const steps = [
  { number: 1, label: 'Personal Info' },
  { number: 2, label: 'Education' },
  { number: 3, label: 'Work History' },
  { number: 4, label: 'Skills' },
  { number: 5, label: 'Motivation' },
];

export const StepNavigation = () => {
  const { currentStep, actions } = useResumeData();
  
  return (
    <div className="flex justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <button
            onClick={() => actions.setCurrentStep(index)}
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              index === currentStep
                ? 'bg-blue-600 text-white'
                : index < currentStep
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step.number}
          </button>
          <span
            className={`ml-2 text-sm ${
              index === currentStep ? 'font-semibold text-blue-600' : 'text-gray-600'
            }`}
          >
            {step.label}
          </span>
          {index < steps.length - 1 && (
            <div className="w-16 h-px bg-gray-300 mx-2" />
          )}
        </div>
      ))}
    </div>
  );
};
```

---

## Step 4: Form Step Components

### 4.1 Personal Information Step

**File:** `components/builder/steps/PersonalInfoStep.tsx`

```typescript
'use client';

import { useFormContext } from 'react-hook-form';
import { ControlledInput, DateInput } from '@/components/forms';

export const PersonalInfoStep = () => {
  const { watch } = useFormContext();
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Personal Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ControlledInput
          name="personalInfo.fullName"
          label="Full Name"
          required
        />
        
        <ControlledInput
          name="personalInfo.katakanaName"
          label="Katakana Name"
          required
        />
        
        <ControlledInput
          name="personalInfo.gender"
          label="Gender"
          required
          type="select"
        />
        
        <DateInput
          name="personalInfo.birthDate"
          label="Birth Date"
          required
        />
        
        <ControlledInput
          name="personalInfo.email"
          label="Email"
          required
          type="email"
        />
        
        <ControlledInput
          name="personalInfo.phone"
          label="Phone"
          required
        />
        
        <ControlledInput
          name="personalInfo.currentAddress"
          label="Current Address"
          required
        />
        
        <ControlledInput
          name="personalInfo.japanAddress"
          label="Japan Address (Optional)"
        />
      </div>
    </div>
  );
};
```

### 4.2 Education Step

**File:** `components/builder/steps/EducationStep.tsx`

```typescript
'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ControlledInput, DateInput } from '@/components/forms';

export const EducationStep = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });
  
  const addEducation = () => {
    append({
      schoolName: "",
      startDate: "",
      endDate: "",
      status: "Graduated",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Education</h2>
        <Button onClick={addEducation}>Add Education</Button>
      </div>
      
      {fields.length === 0 ? (
        <p className="text-gray-500">No education entries added yet.</p>
      ) : (
        fields.map((field, index) => (
          <div key={field.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between">
              <h3 className="font-medium">Education #{index + 1}</h3>
              {index > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ControlledInput
                name={`education.${index}.schoolName`}
                label="School Name"
                required
              />
              <ControlledInput
                name={`education.${index}.status`}
                label="Status"
                required
                type="select"
              />
              <DateInput
                name={`education.${index}.startDate`}
                label="Start Date"
                required
              />
              <DateInput
                name={`education.${index}.endDate`}
                label="End Date"
                required
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};
```

---

## Step 5: Form Validation & Auto-Save

### 5.1 Enhanced Zod Schema

**File:** `lib/schemas/resume.ts` (updated)

```typescript
import { z } from 'zod';

const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const resumeSchema = z.object({
  tier: z.enum(["TITP", "SSW", "ENGINEER"]),
  personalInfo: z.object({
    fullName: z.string().min(1, "Full name is required"),
    katakanaName: z.string().min(1, "Katakana name is required"),
    gender: z.enum(["Male", "Female"]),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
    currentAddress: z.string().min(1, "Current address is required"),
    japanAddress: z.string().optional(),
    email: z.string().regex(emailRegex, "Invalid email format"),
    phone: z.string().regex(phoneRegex, "Invalid phone format"),
    photoUrl: z.string().optional(),
  }),
  education: z.array(z.object({
    schoolName: z.string().min(1, "School name is required"),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid start date"),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid end date"),
    status: z.enum(["Graduated", "Dropout"]),
  })),
  workHistory: z.array(z.object({
    companyName: z.string().min(1, "Company name is required"),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid start date"),
    endDate: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal("Current")]),
    role: z.string().min(1, "Role is required"),
    description: z.string().optional(),
  })),
  skills: z.object({
    jlptLevel: z.enum(["N1", "N2", "N3", "N4", "N5", "None"]).optional(),
    sswCertificates: z.array(z.string()).optional(),
    technicalSkills: z.array(z.string()).optional(),
  }),
  motivation: z.object({
    reasonForApplying: z.string().min(10, "Reason must be at least 10 characters"),
    selfPR: z.string().min(10, "Self-PR must be at least 10 characters"),
  }),
});
```

---

## Step 6: Testing & Verification

### 6.1 Store Testing

**File:** `tests/lib/store/resumeStore.test.ts`

```typescript
import { useResumeStore } from '@/lib/store/resumeStore';
import { renderHook, act } from '@testing-library/react';

describe('Resume Store', () => {
  it('should update personal info', () => {
    const { result } = renderHook(() => useResumeStore());
    
    act(() => {
      result.current.updatePersonalInfo({
        fullName: 'John Doe',
        email: 'john@example.com',
      });
    });
    
    expect(result.current.data.personalInfo.fullName).toBe('John Doe');
    expect(result.current.data.personalInfo.email).toBe('john@example.com');
  });
  
  it('should add education entry', () => {
    const { result } = renderHook(() => useResumeStore());
    
    act(() => {
      result.current.addEducation({
        schoolName: 'Tokyo University',
        startDate: '2018-04-01',
        endDate: '2022-03-31',
        status: 'Graduated',
      });
    });
    
    expect(result.current.data.education).toHaveLength(1);
    expect(result.current.data.education[0].schoolName).toBe('Tokyo University');
  });
});
```

---

## Verification Checklist

### Code Quality
- [ ] TypeScript strict mode maintained
- [ ] Zustand store structure is clean
- [ ] Form validation covers all edge cases
- [ ] Auto-save persists state correctly

### Functionality
- [ ] Form validation shows proper error messages
- [ ] Step navigation works smoothly
- [ ] State updates trigger PDF updates
- [ ] Field arrays (education/work) work correctly

### Performance
- [ ] State updates are efficient
- [ ] Form renders don't cause performance issues
- [ ] Auto-save doesn't cause jank

---

## Deliverables for Phase 2

1. **State Management System**
   - Zustand store with persistence
   - Complete type safety
   - Action handlers for all operations

2. **Form System**
   - React Hook Form integration
   - Zod validation schemas
   - Custom input components

3. **Step-Based UI**
   - Multi-step form navigation
   - Dynamic field arrays
   - Form validation feedback

---

## Estimated Timeline

- Step 1 (Store Implementation): 8 hours
- Step 2 (Form Integration): 6 hours
- Step 3 (Step Navigation): 4 hours
- Step 4 (Form Components): 10 hours
- Step 5 (Validation): 4 hours
- Step 6 (Testing): 3 hours

**Total: ~35 hours (4-5 days)**

---

## Next Phase

After completing Phase 2:
1. Form system is fully integrated
2. State management works reliably
3. Ready for Phase 3: AI Bridge & Gap Detection