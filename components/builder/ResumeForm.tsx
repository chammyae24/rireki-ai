"use client";

import { useResumeData } from "@/lib/hooks/useResumeData";
import { FormProvider, FormObserver } from "@/components/forms";
import { StepNavigation } from "./StepNavigation";
import { PersonalInfoStep, EducationStep } from "./steps";

export const ResumeForm = () => {
  const { resumeData, currentStep, actions } = useResumeData();

  return (
    <FormProvider defaultValues={resumeData}>
      <FormObserver onChange={actions.setData} />
      <div className="flex flex-col h-full">
        <StepNavigation />

        <form className="flex-1 overflow-y-auto pr-2">
          <FormContent currentStep={currentStep} />

          <FormNavigation
            currentStep={currentStep}
            totalSteps={5}
            onNext={() => actions.setCurrentStep(Math.min(currentStep + 1, 4))}
            onPrev={() => actions.setCurrentStep(Math.max(currentStep - 1, 0))}
          />
        </form>
      </div>
    </FormProvider>
  );
};

const FormContent = ({ currentStep }: { currentStep: number }) => {
  switch (currentStep) {
    case 0:
      return <PersonalInfoStep />;
    case 1:
      return <EducationStep />;
    case 2:
      return (
        <div className="text-center py-10 text-gray-500">
          Work History Step (Coming Soon)
        </div>
      );
    case 3:
      return (
        <div className="text-center py-10 text-gray-500">
          Skills Step (Coming Soon)
        </div>
      );
    case 4:
      return (
        <div className="text-center py-10 text-gray-500">
          Motivation Step (Coming Soon)
        </div>
      );
    default:
      return null;
  }
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
