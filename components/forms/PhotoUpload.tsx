"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { User, Camera } from "lucide-react";
import Image from "next/image";

export const PhotoUpload = () => {
  const { setValue, watch } = useFormContext();
  const photoUrl = watch("personalInfo.photoUrl");

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("personalInfo.photoUrl", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-40 border-2 border-dashed rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt="Profile Photo"
            className="w-full h-full object-cover"
            width={128}
            height={160}
          />
        ) : (
          <User className="w-12 h-12 text-gray-300" />
        )}
      </div>
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handlePhoto}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
        />
        <Button variant="outline" size="sm" type="button">
          <Camera className="w-4 h-4 mr-2" />
          {photoUrl ? "Change Photo" : "Upload Photo"}
        </Button>
      </div>
      <p className="text-xs text-gray-500">
        Recommended: 3:4 aspect ratio, max 2MB
      </p>
    </div>
  );
};
