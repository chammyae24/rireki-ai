"use client";

import { RirekishoData } from "@/types/resume";
import { Plus, Trash2 } from "lucide-react";

interface ResumeFormProps {
  data: RirekishoData;
  onChange: (data: RirekishoData) => void;
}

export const ResumeForm = ({ data, onChange }: ResumeFormProps) => {
  const handleChange = (
    field: keyof RirekishoData["personalInfo"],
    value: string,
  ) => {
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value,
      },
    });
  };

  const handleMotivationChange = (
    field: keyof RirekishoData["motivation"],
    value: string,
  ) => {
    onChange({
      ...data,
      motivation: {
        ...data.motivation,
        [field]: value,
      },
    });
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const newEducation = [...data.education];
    newEducation[index] = {
      ...newEducation[index],
      [field]: value,
    };
    onChange({
      ...data,
      education: newEducation,
    });
  };

  const addEducation = () => {
    onChange({
      ...data,
      education: [
        ...data.education,
        {
          schoolName: "",
          startDate: "",
          endDate: "",
          status: "Graduated",
        },
      ],
    });
  };

  const removeEducation = (index: number) => {
    const newEducation = data.education.filter((_, i) => i !== index);
    onChange({
      ...data,
      education: newEducation,
    });
  };

  const handleWorkHistoryChange = (index: number, field: string, value: string) => {
    const newWorkHistory = [...data.workHistory];
    newWorkHistory[index] = {
      ...newWorkHistory[index],
      [field]: value,
    };
    onChange({
      ...data,
      workHistory: newWorkHistory,
    });
  };

  const addWorkHistory = () => {
    onChange({
      ...data,
      workHistory: [
        ...data.workHistory,
        {
          companyName: "",
          startDate: "",
          endDate: "",
          role: "",
          description: "",
        },
      ],
    });
  };

  const removeWorkHistory = (index: number) => {
    const newWorkHistory = data.workHistory.filter((_, i) => i !== index);
    onChange({
      ...data,
      workHistory: newWorkHistory,
    });
  };

  const handleSkillsChange = (field: string, value: any) => {
    onChange({
      ...data,
      skills: {
        ...data.skills,
        [field]: value,
      },
    });
  };

  const handleTechnicalSkillsChange = (index: number, value: string) => {
    const newSkills = [...(data.skills.technicalSkills || [])];
    newSkills[index] = value;
    handleSkillsChange("technicalSkills", newSkills);
  };

  const addTechnicalSkill = () => {
    const newSkills = [...(data.skills.technicalSkills || []), ""];
    handleSkillsChange("technicalSkills", newSkills);
  };

  const removeTechnicalSkill = (index: number) => {
    const newSkills = (data.skills.technicalSkills || []).filter((_, i) => i !== index);
    handleSkillsChange("technicalSkills", newSkills);
  };

  const handleSSWCertificatesChange = (index: number, value: string) => {
    const newCertificates = [...(data.skills.sswCertificates || [])];
    newCertificates[index] = value;
    handleSkillsChange("sswCertificates", newCertificates);
  };

  const addSSWCertificate = () => {
    const newCertificates = [...(data.skills.sswCertificates || []), ""];
    handleSkillsChange("sswCertificates", newCertificates);
  };

  const removeSSWCertificate = (index: number) => {
    const newCertificates = (data.skills.sswCertificates || []).filter((_, i) => i !== index);
    handleSkillsChange("sswCertificates", newCertificates);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={data.personalInfo.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Katakana Name
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={data.personalInfo.katakanaName}
              onChange={(e) => handleChange("katakanaName", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              className="w-full p-2 border rounded-md"
              value={data.personalInfo.birthDate}
              onChange={(e) => handleChange("birthDate", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              className="w-full p-2 border rounded-md"
              value={data.personalInfo.gender}
              onChange={(e) =>
                handleChange("gender", e.target.value as "Male" | "Female")
              }
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">
              Current Address
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={data.personalInfo.currentAddress}
              onChange={(e) => handleChange("currentAddress", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Motivation</h3>
        <div>
          <label className="block text-sm font-medium mb-1">
            Reason for Applying
          </label>
          <textarea
            className="w-full p-2 border rounded-md h-24"
            value={data.motivation.reasonForApplying}
            onChange={(e) =>
              handleMotivationChange("reasonForApplying", e.target.value)
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Self-PR
          </label>
          <textarea
            className="w-full p-2 border rounded-md h-24"
            value={data.motivation.selfPR}
            onChange={(e) =>
              handleMotivationChange("selfPR", e.target.value)
            }
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Education History</h3>
          <button
            type="button"
            onClick={addEducation}
            className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <Plus size={16} />
            Add Education
          </button>
        </div>
        {data.education.map((edu, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">Education #{index + 1}</h4>
              {data.education.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">School Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={edu.schoolName}
                  onChange={(e) => handleEducationChange(index, "schoolName", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="month"
                  className="w-full p-2 border rounded-md"
                  value={edu.startDate}
                  onChange={(e) => handleEducationChange(index, "startDate", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="month"
                  className="w-full p-2 border rounded-md"
                  value={edu.endDate}
                  onChange={(e) => handleEducationChange(index, "endDate", e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={edu.status}
                  onChange={(e) => handleEducationChange(index, "status", e.target.value as "Graduated" | "Dropout")}
                >
                  <option value="Graduated">Graduated</option>
                  <option value="Dropout">Dropout</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Work History</h3>
          <button
            type="button"
            onClick={addWorkHistory}
            className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <Plus size={16} />
            Add Work Experience
          </button>
        </div>
        {data.workHistory.map((work, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">Work Experience #{index + 1}</h4>
              {data.workHistory.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeWorkHistory(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Company Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={work.companyName}
                  onChange={(e) => handleWorkHistoryChange(index, "companyName", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="month"
                  className="w-full p-2 border rounded-md"
                  value={work.startDate}
                  onChange={(e) => handleWorkHistoryChange(index, "startDate", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="month"
                  className="w-full p-2 border rounded-md"
                  value={work.endDate === "Current" ? "" : work.endDate}
                  onChange={(e) => handleWorkHistoryChange(index, "endDate", e.target.value || "Current")}
                />
                <label className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={work.endDate === "Current"}
                    onChange={(e) => handleWorkHistoryChange(index, "endDate", e.target.checked ? "Current" : "")}
                    className="mr-2"
                  />
                  Currently working here
                </label>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Role</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={work.role}
                  onChange={(e) => handleWorkHistoryChange(index, "role", e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="w-full p-2 border rounded-md h-20"
                  value={work.description}
                  onChange={(e) => handleWorkHistoryChange(index, "description", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Skills</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">JLPT Level</label>
            <select
              className="w-full p-2 border rounded-md"
              value={data.skills.jlptLevel || "None"}
              onChange={(e) => handleSkillsChange("jlptLevel", e.target.value)}
            >
              <option value="None">None</option>
              <option value="N5">N5</option>
              <option value="N4">N4</option>
              <option value="N3">N3</option>
              <option value="N2">N2</option>
              <option value="N1">N1</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium">Technical Skills</label>
            <button
              type="button"
              onClick={addTechnicalSkill}
              className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <Plus size={16} />
              Add Skill
            </button>
          </div>
          {(data.skills.technicalSkills || []).map((skill, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded-md"
                value={skill}
                onChange={(e) => handleTechnicalSkillsChange(index, e.target.value)}
                placeholder="e.g., JavaScript, React, Node.js"
              />
              {(data.skills.technicalSkills || []).length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTechnicalSkill(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium">SSW Certificates</label>
            <button
              type="button"
              onClick={addSSWCertificate}
              className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <Plus size={16} />
              Add Certificate
            </button>
          </div>
          {(data.skills.sswCertificates || []).map((certificate, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded-md"
                value={certificate}
                onChange={(e) => handleSSWCertificatesChange(index, e.target.value)}
                placeholder="e.g., Database, IT Service Management"
              />
              {(data.skills.sswCertificates || []).length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSSWCertificate(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
