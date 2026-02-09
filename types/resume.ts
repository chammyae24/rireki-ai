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
