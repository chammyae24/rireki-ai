"use client";

import { useResumeData } from "@/lib/hooks/useResumeData";

const steps = [
  { number: 1, label: "Personal Info" },
  { number: 2, label: "Education" },
  { number: 3, label: "Work History" },
  { number: 4, label: "Skills" },
  { number: 5, label: "Motivation" },
];

export const StepNavigation = () => {
  const { currentStep, actions } = useResumeData();

  return (
    <div className="flex justify-between mb-8 overflow-x-auto pb-2">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center min-w-fit">
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
            {step.number}
          </button>
          <span
            className={`ml-2 text-sm whitespace-nowrap ${
              index === currentStep
                ? "font-semibold text-blue-600"
                : "text-gray-600"
            }`}
          >
            {step.label}
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
