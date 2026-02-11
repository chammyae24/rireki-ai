"use client";

import { useResumeData } from "@/lib/hooks/useResumeData";
import { FormProvider, FormObserver } from "@/components/forms";
import { StepNavigation } from "./StepNavigation";
import {
  PersonalInfoStep,
  EducationStep,
  PhysicalStatsStep,
  FamilyDetailsStep,
} from "./steps";

export const ResumeForm = () => {
  const { resumeData, currentStep, actions } = useResumeData();

  // Define steps based on tier
  const steps = [
    { component: <PersonalInfoStep />, label: "Personal Info" },
    ...(resumeData.tier === "TITP"
      ? [
          { component: <PhysicalStatsStep />, label: "Physical Stats" },
          { component: <FamilyDetailsStep />, label: "Family Details" },
        ]
      : []),
    { component: <EducationStep />, label: "Education" },
    {
      component: (
        <div className="text-center py-10 text-gray-500">
          Work History Step (Coming Soon)
        </div>
      ),
      label: "Work History",
    },
    {
      component: (
        <div className="text-center py-10 text-gray-500">
          Skills Step (Coming Soon)
        </div>
      ),
      label: "Skills",
    },
    {
      component: (
        <div className="text-center py-10 text-gray-500">
          Motivation Step (Coming Soon)
        </div>
      ),
      label: "Motivation",
    },
  ];

  const totalSteps = steps.length;
  // Ensure we don't crash if step index is out of bounds after tier switch
  const safeCurrentStep = Math.min(currentStep, totalSteps - 1);
  const currentStepComponent = steps[safeCurrentStep]?.component || null;

  return (
    <FormProvider defaultValues={resumeData}>
      <FormObserver onChange={actions.setData} />
      <div className="flex flex-col h-full">
        <StepNavigation
          currentStep={safeCurrentStep}
          steps={steps.map((s) => s.label)}
        />

        <div className="flex-1 overflow-y-auto pr-2">
          {currentStepComponent}

          <FormNavigation
            currentStep={safeCurrentStep}
            totalSteps={totalSteps}
            onNext={() =>
              actions.setCurrentStep(
                Math.min(safeCurrentStep + 1, totalSteps - 1),
              )
            }
            onPrev={() =>
              actions.setCurrentStep(Math.max(safeCurrentStep - 1, 0))
            }
          />
        </div>
      </div>
    </FormProvider>
  );
};

const FormNavigation = ({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
}: {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
}) => {
  return (
    <div className="flex justify-between mt-8 pt-4 border-t">
      <button
        type="button"
        onClick={onPrev}
        disabled={currentStep === 0}
        className={`px-4 py-2 rounded-md ${
          currentStep === 0
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        Previous
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={currentStep === totalSteps - 1}
        className={`px-4 py-2 rounded-md ${
          currentStep === totalSteps - 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        Next
      </button>
    </div>
  );
};
