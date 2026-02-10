import { useResumeStore } from "@/lib/store/resumeStore";

export const useResumeData = () => {
  const {
    data,
    setData,
    currentStep,
    errors,
    updatePersonalInfo,
    addEducation,
    updateEducation,
    removeEducation,
    addWorkHistory,
    updateWorkHistory,
    removeWorkHistory,
    updateSkills,
    updateMotivation,
    setTier,
    setCurrentStep,
    setErrors,
    clearErrors,
    reset,
  } = useResumeStore();

  return {
    resumeData: data,
    currentStep,
    errors,
    actions: {
      setData,
      updatePersonalInfo,
      addEducation,
      updateEducation,
      removeEducation,
      addWorkHistory,
      updateWorkHistory,
      removeWorkHistory,
      updateSkills,
      updateMotivation,
      setTier,
      setCurrentStep,
      setErrors,
      clearErrors,
      reset,
    },
  };
};
