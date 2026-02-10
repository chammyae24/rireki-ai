"use client";

import { useFormContext } from "react-hook-form";

interface ControlledInputProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

export const ControlledInput = ({
  name,
  label,
  type = "text",
  placeholder,
  required = false,
}: ControlledInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  // Handle nested errors (e.g., personalInfo.firstName)
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
      {type === "select" ? (
        <select
          {...register(name)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      ) : (
        <input
          type={type}
          {...register(name)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md shadow-sm ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
      )}

      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  );
};
