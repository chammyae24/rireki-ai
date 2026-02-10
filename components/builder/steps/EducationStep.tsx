"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { ControlledInput, DateInput } from "@/components/forms";
import { Plus, Trash2 } from "lucide-react";

export const EducationStep = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "education",
  });

  const addEducation = () => {
    append({
      schoolName: "",
      startDate: "",
      endDate: "",
      status: "Graduated",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Education</h2>
        <button
          type="button"
          onClick={addEducation}
          className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <Plus size={16} />
          Add Education
        </button>
      </div>

      {fields.length === 0 ? (
        <p className="text-gray-500 text-center py-8 border-2 border-dashed rounded-lg">
          No education entries added yet. Click "Add Education" to start.
        </p>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border rounded-lg p-4 space-y-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="font-medium text-gray-700">
                  Education #{index + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700 transition-colors bg-red-50 p-1 rounded"
                  title="Remove entry"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <ControlledInput
                    name={`education.${index}.schoolName`}
                    label="School Name"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...control.register(`education.${index}.status`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    >
                      <option value="Graduated">Graduated</option>
                      <option value="Dropout">Dropout</option>
                    </select>
                  </div>
                </div>
                <DateInput
                  name={`education.${index}.startDate`}
                  label="Start Date"
                  required
                />
                <DateInput
                  name={`education.${index}.endDate`}
                  label="End Date"
                  required
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
