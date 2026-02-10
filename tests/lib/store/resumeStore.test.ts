import { useResumeStore } from "@/lib/store/resumeStore";
import { renderHook, act } from "@testing-library/react";

// Mock persist middleware to avoid storage issues in tests
jest.mock("zustand/middleware", () => ({
  persist: (config: any) => (set: any, get: any, api: any) =>
    config(set, get, api),
}));

describe("Resume Store", () => {
  beforeEach(() => {
    const { result } = renderHook(() => useResumeStore());
    act(() => {
      result.current.reset();
    });
  });

  it("should update personal info", () => {
    const { result } = renderHook(() => useResumeStore());

    act(() => {
      result.current.updatePersonalInfo({
        fullName: "John Doe",
        email: "john@example.com",
      });
    });

    expect(result.current.data.personalInfo.fullName).toBe("John Doe");
    expect(result.current.data.personalInfo.email).toBe("john@example.com");
  });

  it("should add education entry", () => {
    const { result } = renderHook(() => useResumeStore());

    act(() => {
      result.current.addEducation({
        schoolName: "Tokyo University",
        startDate: "2018-04-01",
        endDate: "2022-03-31",
        status: "Graduated",
      });
    });

    expect(result.current.data.education).toHaveLength(1);
    expect(result.current.data.education[0].schoolName).toBe(
      "Tokyo University",
    );
  });

  it("should remove education entry", () => {
    const { result } = renderHook(() => useResumeStore());

    act(() => {
      result.current.addEducation({
        schoolName: "Tokyo University",
        startDate: "2018-04-01",
        endDate: "2022-03-31",
        status: "Graduated",
      });
    });

    act(() => {
      result.current.removeEducation(0);
    });

    expect(result.current.data.education).toHaveLength(0);
  });
});
