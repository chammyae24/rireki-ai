import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RirekishoData, VisaTier } from "@/types/resume";

interface ResumeState {
  data: RirekishoData;
  currentStep: number;
  isLoading: boolean;
  errors: Record<string, string[]>;

  // Actions
  setData: (data: Partial<RirekishoData>) => void;
  updatePersonalInfo: (info: Partial<RirekishoData["personalInfo"]>) => void;
  addEducation: (edu: RirekishoData["education"][0]) => void;
  updateEducation: (
    index: number,
    edu: Partial<RirekishoData["education"][0]>,
  ) => void;
  removeEducation: (index: number) => void;
  addWorkHistory: (work: RirekishoData["workHistory"][0]) => void;
  updateWorkHistory: (
    index: number,
    work: Partial<RirekishoData["workHistory"][0]>,
  ) => void;
  removeWorkHistory: (index: number) => void;
  updateSkills: (skills: Partial<RirekishoData["skills"]>) => void;
  updateMotivation: (motivation: Partial<RirekishoData["motivation"]>) => void;
  setTier: (tier: VisaTier) => void;
  setCurrentStep: (step: number) => void;
  setErrors: (errors: Record<string, string[]>) => void;
  clearErrors: () => void;
  reset: () => void;
}

const initialState: RirekishoData = {
  tier: "ENGINEER",
  personalInfo: {
    fullName: "",
    katakanaName: "",
    gender: "Male",
    birthDate: "",
    currentAddress: "",
    japanAddress: "",
    email: "",
    phone: "",
    photoUrl: "",
  },
  education: [],
  workHistory: [],
  skills: {},
  motivation: {
    reasonForApplying: "",
    selfPR: "",
  },
};

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      data: initialState,
      currentStep: 0,
      isLoading: false,
      errors: {},

      setData: (newData) =>
        set((state) => ({
          data: { ...state.data, ...newData },
        })),

      updatePersonalInfo: (info) =>
        set((state) => ({
          data: {
            ...state.data,
            personalInfo: { ...state.data.personalInfo, ...info },
          },
        })),

      addEducation: (edu) =>
        set((state) => ({
          data: {
            ...state.data,
            education: [...state.data.education, edu],
          },
        })),

      updateEducation: (index, edu) =>
        set((state) => {
          const education = [...state.data.education];
          education[index] = { ...education[index], ...edu };
          return { data: { ...state.data, education } };
        }),

      removeEducation: (index) =>
        set((state) => ({
          data: {
            ...state.data,
            education: state.data.education.filter((_, i) => i !== index),
          },
        })),

      addWorkHistory: (work) =>
        set((state) => ({
          data: {
            ...state.data,
            workHistory: [...state.data.workHistory, work],
          },
        })),

      updateWorkHistory: (index, work) =>
        set((state) => {
          const workHistory = [...state.data.workHistory];
          workHistory[index] = { ...workHistory[index], ...work };
          return { data: { ...state.data, workHistory } };
        }),

      removeWorkHistory: (index) =>
        set((state) => ({
          data: {
            ...state.data,
            workHistory: state.data.workHistory.filter((_, i) => i !== index),
          },
        })),

      updateSkills: (skills) =>
        set((state) => ({
          data: {
            ...state.data,
            skills: { ...state.data.skills, ...skills },
          },
        })),

      updateMotivation: (motivation) =>
        set((state) => ({
          data: {
            ...state.data,
            motivation: { ...state.data.motivation, ...motivation },
          },
        })),

      setTier: (tier) =>
        set((state) => ({
          data: { ...state.data, tier },
        })),

      setCurrentStep: (step) => set({ currentStep: step }),

      setErrors: (errors) => set({ errors }),

      clearErrors: () => set({ errors: {} }),

      reset: () => set({ data: initialState, currentStep: 0, errors: {} }),
    }),
    {
      name: "resume-storage",
    },
  ),
);
