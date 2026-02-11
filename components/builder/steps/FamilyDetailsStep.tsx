"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { ControlledInput } from "@/components/forms";
import { Plus, Trash2 } from "lucide-react";

export const FamilyDetailsStep = () => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "personalInfo.familyDetails",
  });

  const addFamilyMember = () => {
    append({
      name: "",
      relationship: "",
      age: 0,
      occupation: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Family Details</h2>
        <button
          type="button"
          onClick={addFamilyMember}
          className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <Plus size={16} />
          Add Family Member
        </button>
      </div>

      {fields.length === 0 ? (
        <p className="text-gray-500 text-center py-8 border-2 border-dashed rounded-lg">
          No family members added yet. Click "Add Family Member" to start.
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
                  Family Member #{index + 1}
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
                <ControlledInput
                  name={`personalInfo.familyDetails.${index}.name`}
                  label="Name"
                  placeholder="e.g. John Doe"
                  required
                />
                <ControlledInput
                  name={`personalInfo.familyDetails.${index}.relationship`}
                  label="Relationship"
                  placeholder="e.g. Father, Mother"
                  required
                />
                <ControlledInput
                  name={`personalInfo.familyDetails.${index}.age`}
                  label="Age"
                  type="number"
                  placeholder="e.g. 50"
                  required
                />
                <ControlledInput
                  name={`personalInfo.familyDetails.${index}.occupation`}
                  label="Occupation"
                  placeholder="e.g. Farmer, Teacher"
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
