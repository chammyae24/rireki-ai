"use client";

import { useState } from "react";
import { useResumeData } from "@/lib/hooks/useResumeData";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, Check, AlertCircle, Loader2 } from "lucide-react";

export const CVUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const { actions } = useResumeData();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/parse-cv", {
        method: "POST",
        body: formData,
      });

      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to parse CV");
      }

      const parsedData = await response.json();

      // Merge parsed data with current resume
      if (parsedData.personalInfo) {
        actions.updatePersonalInfo(parsedData.personalInfo);
      }

      if (parsedData.education?.length > 0) {
        parsedData.education.forEach((edu: any) => {
          actions.addEducation(edu);
        });
      }

      if (parsedData.workHistory?.length > 0) {
        parsedData.workHistory.forEach((work: any) => {
          actions.addWorkHistory(work);
        });
      }

      if (parsedData.skills?.length > 0) {
        actions.updateSkills({
          technicalSkills: parsedData.skills,
        });
      }

      setUploadStatus("success");
      setProgress(100);

      // Reset after 3 seconds
      setTimeout(() => {
        setUploadStatus("idle");
        setProgress(0);
      }, 3000);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 border-b bg-white">
      <h4 className="text-sm font-medium mb-2">Upload Existing CV</h4>

      <div className="relative">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />

        <Button
          variant="outline"
          className="w-full justify-center"
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : uploadStatus === "success" ? (
            <Check className="w-4 h-4 mr-2 text-green-600" />
          ) : uploadStatus === "error" ? (
            <AlertCircle className="w-4 h-4 mr-2 text-red-600" />
          ) : (
            <Upload className="w-4 h-4 mr-2" />
          )}

          {isUploading
            ? "Parsing..."
            : uploadStatus === "success"
              ? "CV Parsed!"
              : uploadStatus === "error"
                ? "Try Again"
                : "Upload PDF or Word"}
        </Button>
      </div>

      {progress > 0 && <Progress value={progress} className="mt-2" />}

      <p className="text-xs text-gray-500 mt-2">
        Supports PDF, DOC, and DOCX files.
        <br />
        <span className="text-blue-600">
          Note: This will append to your current data.
        </span>
      </p>
    </div>
  );
};
