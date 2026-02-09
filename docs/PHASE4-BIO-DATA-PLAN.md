# Phase 4: TITP Bio-Data Support Implementation Plan

## Overview

This Phase focuses on implementing support for the TITP-specific "Bio-Data" format, which is distinct from the standard JIS Rirekisho. It includes additional sections for family details, physical measurements, and health information.

---

## Step 1: Data Model Expansion

### 1.1 Update Type Definitions

**File:** `types/resume.ts` (updated)

```typescript
export interface FamilyDetail {
  name: string;
  relationship: string;
  age: number;
  occupation: string;
}

export interface PhysicalStats {
  heightCm: number;
  weightKg: number;
  bloodType?: string;
  handz: "Right" | "Left";
}

export interface RirekishoData {
  // ... existing fields
  personalInfo: {
    // ... existing fields
    familyDetails?: FamilyDetail[];
    physicalStats?: PhysicalStats;
  };
}
```

### 1.2 Update Zod Schemas

**File:** `lib/schemas/resume.ts` (updated)

```typescript
const familyDetailSchema = z.object({
  name: z.string().min(1, "Name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  age: z.number().min(0).max(120),
  occupation: z.string().min(1, "Occupation is required"),
});

const physicalStatsSchema = z.object({
  heightCm: z.number().min(50).max(250),
  weightKg: z.number().min(20).max(300),
  bloodType: z.string().optional(),
  handz: z.enum(["Right", "Left"]),
});

// Update main schema to include these optionally
export const resumeSchema = z.object({
  // ...
  personalInfo: personalInfoSchema.extend({
    familyDetails: z.array(familyDetailSchema).optional(),
    physicalStats: physicalStatsSchema.optional(),
  }),
});
```

---

## Step 2: Bio-Data PDF Template

### 2.1 Create BioDataDocument Component

**File:** `components/pdf/BioDataDocument.tsx`

```typescript
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { RirekishoData } from '@/types/resume';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'NotoSansJP',
    padding: 40,
    fontSize: 11,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 700,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    backgroundColor: '#f3f4f6',
    padding: 5,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 150,
    fontWeight: 700,
  },
  value: {
    flex: 1,
  },
  table: {
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderColor: '#000',
  },
});

export const BioDataDocument = ({ data }: { data: RirekishoData }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>BIO-DATA</Text>
        
        {/* Personal Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. PERSONAL DETAILS</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Full Name:</Text>
            <Text style={styles.value}>{data.personalInfo.fullName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Gender:</Text>
            <Text style={styles.value}>{data.personalInfo.gender}</Text>
          </View>
          {data.personalInfo.physicalStats && (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>Height/Weight:</Text>
                <Text style={styles.value}>
                  {data.personalInfo.physicalStats.heightCm}cm / {data.personalInfo.physicalStats.weightKg}kg
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Hand:</Text>
                <Text style={styles.value}>{data.personalInfo.physicalStats.handz} Handed</Text>
              </View>
            </>
          )}
        </View>
        
        {/* Family Details */}
        {data.personalInfo.familyDetails && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. FAMILY DETAILS</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '30%' }]}>Relationship</Text>
                <Text style={[styles.tableCell, { width: '40%' }]}>Name</Text>
                <Text style={[styles.tableCell, { width: '10%' }]}>Age</Text>
                <Text style={[styles.tableCell, { width: '20%' }]}>Occupation</Text>
              </View>
              {data.personalInfo.familyDetails.map((f, i) => (
                <View key={i} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '30%' }]}>{f.relationship}</Text>
                  <Text style={[styles.tableCell, { width: '40%' }]}>{f.name}</Text>
                  <Text style={[styles.tableCell, { width: '10%' }]}>{f.age}</Text>
                  <Text style={[styles.tableCell, { width: '20%' }]}>{f.occupation}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        
        {/* Other sections similarly styled... */}
      </Page>
    </Document>
  );
};
```

---

## Step 3: Dynamic Template Selection

### 3.1 Template Router

**File:** `components/pdf/DocumentRouter.tsx`

```typescript
import { RirekishoDocument } from './RirekishoDocument';
import { BioDataDocument } from './BioDataDocument';
import { RirekishoData } from '@/types/resume';

export const DocumentRouter = ({ data }: { data: RirekishoData }) => {
  // TITP uses Bio-Data style, others use JIS Rirekisho
  if (data.tier === 'TITP') {
    return <BioDataDocument data={data} />;
  }
  
  return <RirekishoDocument data={data} />;
};
```

---

## Step 4: UI Support for Extra Fields

### 4.1 Physical Stats Form

**File:** `components/builder/steps/PhysicalStatsStep.tsx`

```typescript
'use client';

import { useFormContext } from 'react-hook-form';
import { ControlledInput } from '@/components/forms';

export const PhysicalStatsStep = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Physical Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <ControlledInput
          name="personalInfo.physicalStats.heightCm"
          label="Height (cm)"
          type="number"
          required
        />
        <ControlledInput
          name="personalInfo.physicalStats.weightKg"
          label="Weight (kg)"
          type="number"
          required
        />
        <ControlledInput
          name="personalInfo.physicalStats.bloodType"
          label="Blood Type"
        />
        <ControlledInput
          name="personalInfo.physicalStats.handz"
          label="Dominant Hand"
          type="select"
          required
        />
      </div>
    </div>
  );
};
```

---

## Step 5: Photo Upload Integration

### 5.1 Photo Selection Component

**File:** `components/forms/PhotoUpload.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { User, Camera } from 'lucide-react';

export const PhotoUpload = () => {
  const { setValue, watch } = useFormContext();
  const photoUrl = watch('personalInfo.photoUrl');
  
  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('personalInfo.photoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-40 border-2 border-dashed rounded-md overflow-hidden bg-gray-50">
        {photoUrl ? (
          <img src={photoUrl} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <User className="w-12 h-12 text-gray-300" />
          </div>
        )}
      </div>
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handlePhoto}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <Button variant="outline" size="sm">
          <Camera className="w-4 h-4 mr-2" />
          Change Photo
        </Button>
      </div>
    </div>
  );
};
```

---

## Step 6: Testing & Verification

### 6.1 Template Verification

- [ ] TITP tier correctly triggers Bio-Data template
- [ ] ENGINEER/SSW tiers correctly trigger Rirekisho template
- [ ] Family details table renders correctly in Bio-Data
- [ ] Physical stats display correctly in both formats where applicable
- [ ] Photo renders at correct aspect ratio in PDF (approx 3x4 ratio)

---

## Verification Checklist

### Code Quality
- [ ] Tier-based conditional logic is clean
- [ ] Bio-Data template follows design specifications
- [ ] Reusable table components extracted

### Functionality
- [ ] PDF templates switch seamlessly based on tier
- [ ] Additional TITP fields persist in state
- [ ] Photo upload works and renders in PDF

### Performance
- [ ] Template switching is instantaneous
- [ ] PDF generation remains performant with images

---

## Deliverables for Phase 4

1. **Secondary PDF Template**
   - Bio-Data document implementation
   - Support for family/health sections
   - Different layout (list vs grid)

2. **Template Router**
   - Automatic selection based on visa tier

3. **Expanded Form UI**
   - Family details management
   - Physical stats inputs
   - Photo upload functionality

---

## Estimated Timeline

- Step 1 (Data Model): 3 hours
- Step 2 (Bio-Data PDF): 12 hours
- Step 3 (Router): 2 hours
- Step 4 (UI Support): 8 hours
- Step 5 (Photo Upload): 6 hours
- Step 6 (Testing): 4 hours

**Total: ~35 hours (4-5 days)**

---

## Next Steps

After completing Phase 4:
1. All templates are functional
2. Support for all visa tiers is complete
3. Project is ready for Final Polish & Deployment
