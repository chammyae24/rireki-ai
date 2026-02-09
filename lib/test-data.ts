import { RirekishoData } from "@/types/resume";

export const sampleData: RirekishoData = {
  tier: "ENGINEER",
  personalInfo: {
    fullName: "山田 太郎",
    katakanaName: "ヤマダ タロウ",
    gender: "Male",
    birthDate: "1990-01-01",
    currentAddress: "東京都渋谷区...",
    email: "taro.yamada@example.com",
    phone: "090-1234-5678",
  },
  education: [
    {
      schoolName: "Test University",
      startDate: "2010-04",
      endDate: "2014-03",
      status: "Graduated",
    },
  ],
  workHistory: [
    {
      companyName: "Tech Company",
      startDate: "2014-04",
      endDate: "Current",
      role: "Developer",
      description: "Frontend development",
    },
  ],
  skills: {
    jlptLevel: "N2",
    technicalSkills: ["React", "TypeScript"],
  },
  motivation: {
    reasonForApplying: "御社のビジョンに共感しました。",
    selfPR: "粘り強い性格です。",
  },
};
