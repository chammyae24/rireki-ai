"use client";

import { useResumeData } from "@/lib/hooks/useResumeData";

interface StepNavigationProps {
  currentStep: number;
  steps: string[];
}

export const StepNavigation = ({ currentStep, steps }: StepNavigationProps) => {
  const { actions } = useResumeData();

  return (
    <div className="flex justify-between mb-8 overflow-x-auto pb-2">
      {steps.map((label, index) => (
        <div key={index} className="flex items-center min-w-fit">
          <button
            onClick={() => actions.setCurrentStep(index)}
            className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
              index === currentStep
                ? "bg-blue-600 text-white"
                : index < currentStep
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
            }`}
          >
            {index + 1}
          </button>
          <span
            className={`ml-2 text-sm whitespace-nowrap ${
              index === currentStep
                ? "font-semibold text-blue-600"
                : "text-gray-600"
            }`}
          >
            {label}
          </span>
          {index < steps.length - 1 && (
            <div
              className={`w-8 md:w-16 h-px mx-2 ${
                index < currentStep ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
