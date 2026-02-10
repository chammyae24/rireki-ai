"use client";

import { PDFProvider } from "@/components/pdf/PDFProvider";
import { ResumeForm } from "@/components/builder/ResumeForm";
import { useResumeData } from "@/lib/hooks/useResumeData";

export default function BuilderPage() {
  // Use global store data for PDF preview
  // In a real app complexity, we might want to debounce this or only update on valid steps
  const { resumeData } = useResumeData();

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/2 p-6 overflow-y-auto border-r bg-white">
        <h1 className="text-2xl font-bold mb-6">Resume Builder</h1>
        <ResumeForm />
      </div>

      <div className="w-1/2 p-6 bg-gray-100 flex flex-col">
        <h2 className="text-xl font-semibold mb-4 text-center">Preview</h2>
        <div className="flex-1">
          <PDFProvider data={resumeData} />
        </div>
      </div>
    </div>
  );
}
