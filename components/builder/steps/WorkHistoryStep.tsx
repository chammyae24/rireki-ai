"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { ControlledInput, DateInput, TextArea } from "@/components/forms";
import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

export const WorkHistoryStep = () => {
  const { control, watch, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "workHistory",
  });

  const addWorkHistory = () => {
    append({
      companyName: "",
      role: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Work History</h2>
        <button
          type="button"
          onClick={addWorkHistory}
          className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <Plus size={16} />
          Add Work History
        </button>
      </div>

      {fields.length === 0 ? (
        <p className="text-gray-500 text-center py-8 border-2 border-dashed rounded-lg">
          No work history entries added yet. Click "Add Work History" to start.
        </p>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <WorkHistoryItem
              key={field.id}
              index={index}
              remove={remove}
              control={control}
              watch={watch}
              setValue={setValue}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const WorkHistoryItem = ({
  index,
  remove,
  control,
  watch,
  setValue,
}: {
  index: number;
  remove: (index: number) => void;
  control: any;
  watch: any;
  setValue: any;
}) => {
  const endDateValue = watch(`workHistory.${index}.endDate`);
  const [isCurrent, setIsCurrent] = useState(endDateValue === "Current");

  useEffect(() => {
    if (isCurrent) {
      setValue(`workHistory.${index}.endDate`, "Current");
    } else if (endDateValue === "Current") {
      setValue(`workHistory.${index}.endDate`, "");
    }
  }, [isCurrent, setValue, index, endDateValue]);

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="font-medium text-gray-700">Work History #{index + 1}</h3>
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
            name={`workHistory.${index}.companyName`}
            label="Company Name"
            required
          />
        </div>
        <div className="md:col-span-2">
          <ControlledInput
            name={`workHistory.${index}.role`}
            label="Role / Job Title"
            required
          />
        </div>
        <DateInput
          name={`workHistory.${index}.startDate`}
          label="Start Date"
          required
        />
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">
              End Date
              {!isCurrent && <span className="text-red-500"> *</span>}
            </label>
            <label className="flex items-center text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={isCurrent}
                onChange={(e) => setIsCurrent(e.target.checked)}
                className="mr-2 rounded text-blue-600 focus:ring-blue-500"
              />
              Current Job
            </label>
          </div>
          {!isCurrent && (
            <DateInput
              name={`workHistory.${index}.endDate`}
              label="" // Label handled above
              required
            />
          )}
          {isCurrent && (
            <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-md">
              Present
            </div>
          )}
        </div>
        <div className="md:col-span-2">
          <TextArea
            name={`workHistory.${index}.description`}
            label="Job Description"
            rows={3}
            placeholder="Describe your responsibilities and achievements..."
          />
        </div>
      </div>
    </div>
  );
};
