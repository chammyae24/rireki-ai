"use client";

import { useFormContext } from "react-hook-form";

interface DateInputProps {
  name: string;
  label: string;
  required?: boolean;
}

export const DateInput = ({
  name,
  label,
  required = false,
}: DateInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  // Handle nested errors
  const getError = (path: string) => {
    return path.split(".").reduce((obj: any, key) => obj && obj[key], errors);
  };

  const error = getError(name);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <input
        type="date"
        {...register(name)}
        className={`w-full px-3 py-2 border rounded-md shadow-sm ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  );
};
