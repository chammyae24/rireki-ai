"use client";

import { useFormContext } from "react-hook-form";
import { ControlledInput, DateInput } from "@/components/forms";

export const PersonalInfoStep = () => {
  const { watch } = useFormContext();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Personal Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ControlledInput
          name="personalInfo.fullName"
          label="Full Name"
          required
        />

        <ControlledInput
          name="personalInfo.katakanaName"
          label="Katakana Name"
          required
        />

        <ControlledInput
          name="personalInfo.gender"
          label="Gender"
          required
          type="select"
        />

        <DateInput name="personalInfo.birthDate" label="Birth Date" required />

        <ControlledInput
          name="personalInfo.email"
          label="Email"
          required
          type="email"
        />

        <ControlledInput name="personalInfo.phone" label="Phone" required />

        <ControlledInput
          name="personalInfo.currentAddress"
          label="Current Address"
          required
        />

        <ControlledInput
          name="personalInfo.japanAddress"
          label="Japan Address (Optional)"
        />
      </div>
    </div>
  );
};
