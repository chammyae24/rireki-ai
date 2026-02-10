"use client";

import { PDFProvider } from "@/components/pdf/PDFProvider";
import { ResumeForm } from "@/components/builder/ResumeForm";
import { useResumeData } from "@/lib/hooks/useResumeData";
import { GapHunterSidebar } from "@/components/features/GapHunter/GapHunterSidebar";

export default function BuilderPage() {
  const { resumeData } = useResumeData();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Left Panel - Form */}
      <div className="w-[40%] flex flex-col border-r bg-white h-full">
        <div className="p-6 overflow-y-auto flex-1">
          <h1 className="text-2xl font-bold mb-6">Resume Builder</h1>
          <ResumeForm />
        </div>
      </div>

      {/* Middle Panel - Preview */}
      <div className="w-[35%] bg-gray-100 flex flex-col h-full border-r">
        <div className="p-4 border-b bg-white shadow-sm">
          <h2 className="text-sm font-semibold text-gray-600 text-center uppercase tracking-wide">
            Live Preview
          </h2>
        </div>
        <div className="flex-1 p-6 overflow-y-auto flex justify-center">
          <div className="w-full max-w-[210mm] shadow-lg">
            <PDFProvider data={resumeData} />
          </div>
        </div>
      </div>

      {/* Right Panel - AI Assistant */}
      <div className="w-[25%] bg-white h-full flex flex-col">
        <GapHunterSidebar />
      </div>
    </div>
  );
}
