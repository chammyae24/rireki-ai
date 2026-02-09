"use client";

import { useState } from "react";
import { PDFProvider } from "@/components/pdf/PDFProvider";
import { ResumeForm } from "@/components/builder/ResumeForm";
import { RirekishoData } from "@/types/resume";
import { sampleData } from "@/lib/test-data";

// Initialize with empty structure if sample data is not enough
const initialData: RirekishoData = sampleData || {
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
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/2 p-6 overflow-y-auto border-r bg-white">
        <h1 className="text-2xl font-bold mb-6">Resume Builder</h1>
        <ResumeForm data={data} onChange={setData} />
      </div>

      <div className="w-1/2 p-6 bg-gray-100 flex flex-col">
        <h2 className="text-xl font-semibold mb-4 text-center">Preview</h2>
        <div className="flex-1">
          <PDFProvider data={data} />
        </div>
      </div>
    </div>
  );
}
