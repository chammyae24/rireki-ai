"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { ControlledInput, TextArea } from "@/components/forms";
import { Plus, X } from "lucide-react";

export const SkillsStep = () => {
  const { control, register } = useFormContext();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Skills & Qualifications</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Japanese Language Proficiency (JLPT)
            </label>
            <select
              {...register("skills.jlptLevel")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="None">None</option>
              <option value="N5">N5 (Basic)</option>
              <option value="N4">N4 (Elementary)</option>
              <option value="N3">N3 (Intermediate)</option>
              <option value="N2">N2 (Pre-Advanced)</option>
              <option value="N1">N1 (Advanced)</option>
            </select>
          </div>
        </div>
      </div>

      <StringList
        name="skills.sswCertificates"
        label="SSW Certificates"
        placeholder="e.g. Care Worker, Food Service..."
      />
      <StringList
        name="skills.technicalSkills"
        label="Technical Skills"
        placeholder="e.g. Welding, Forklift, Java, React..."
      />
    </div>
  );
};

const StringList = ({
  name,
  label,
  placeholder,
}: {
  name: string;
  label: string;
  placeholder: string;
}) => {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: name,
  });

  const handleAdd = () => {
    append("");
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <button
          type="button"
          onClick={handleAdd}
          className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-800"
        >
          <Plus size={14} /> Add
        </button>
      </div>
      {fields.length === 0 && (
        <p className="text-sm text-gray-500 italic">No items added.</p>
      )}
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <input
              {...register(`${name}.${index}`)}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-500 hover:text-red-700 p-2"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
