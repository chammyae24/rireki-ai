"use client";

import { RirekishoData } from "@/types/resume";

interface ResumeFormProps {
  data: RirekishoData;
  onChange: (data: RirekishoData) => void;
}

export const ResumeForm = ({ data, onChange }: ResumeFormProps) => {
  const handleChange = (
    field: keyof RirekishoData["personalInfo"],
    value: string,
  ) => {
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value,
      },
    });
  };

  const handleMotivationChange = (
    field: keyof RirekishoData["motivation"],
    value: string,
  ) => {
    onChange({
      ...data,
      motivation: {
        ...data.motivation,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={data.personalInfo.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Katakana Name
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={data.personalInfo.katakanaName}
              onChange={(e) => handleChange("katakanaName", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              className="w-full p-2 border rounded-md"
              value={data.personalInfo.birthDate}
              onChange={(e) => handleChange("birthDate", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              className="w-full p-2 border rounded-md"
              value={data.personalInfo.gender}
              onChange={(e) =>
                handleChange("gender", e.target.value as "Male" | "Female")
              }
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">
              Current Address
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={data.personalInfo.currentAddress}
              onChange={(e) => handleChange("currentAddress", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Motivation</h3>
        <div>
          <label className="block text-sm font-medium mb-1">
            Reason for Applying
          </label>
          <textarea
            className="w-full p-2 border rounded-md h-24"
            value={data.motivation.reasonForApplying}
            onChange={(e) =>
              handleMotivationChange("reasonForApplying", e.target.value)
            }
          />
        </div>
      </div>
    </div>
  );
};
