export type VisaTier = "TITP" | "SSW" | "ENGINEER";

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
    familyDetails?: FamilyDetail[];
    physicalStats?: PhysicalStats;
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
