"use client";

import { useFormContext } from "react-hook-form";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label: string;
  helperText?: string;
}

export const TextArea = ({
  name,
  label,
  helperText,
  className = "",
  ...props
}: TextAreaProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  // Access nested errors (e.g., "personalInfo.fullName")
  const error = name.split(".").reduce((obj, key) => obj?.[key], errors as any);

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={name}
        {...register(name, { required: props.required })}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
        {...props}
      />
      {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
      {error && (
        <p className="text-sm text-red-500 mt-1">
          {(error as any)?.message || "This field is required"}
        </p>
      )}
    </div>
  );
};
