"use client";

import { useFormContext } from "react-hook-form";
import { ControlledInput } from "@/components/forms";

export const PhysicalStatsStep = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Physical Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <ControlledInput
          name="personalInfo.physicalStats.heightCm"
          label="Height (cm)"
          type="number"
          placeholder="e.g. 175"
        />
        <ControlledInput
          name="personalInfo.physicalStats.weightKg"
          label="Weight (kg)"
          type="number"
          placeholder="e.g. 70"
        />
        <ControlledInput
          name="personalInfo.physicalStats.bloodType"
          label="Blood Type"
          placeholder="e.g. A, B, O, AB"
        />
        <ControlledInput
          name="personalInfo.physicalStats.handz"
          label="Dominant Hand"
          type="select"
          options={[
            { value: "Right", label: "Right" },
            { value: "Left", label: "Left" },
          ]}
        />
      </div>
    </div>
  );
};
