"use client";

import { useFormContext } from "react-hook-form";
import { TextArea } from "@/components/forms";

export const MotivationStep = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Motivation & Self PR</h2>

      <div className="space-y-6">
        <TextArea
          name="motivation.reasonForApplying"
          label="Reason for Applying (志望動機)"
          rows={6}
          placeholder="Explain why you want to work for this company..."
          helperText="Focus on why you are interested in this specific company and role."
        />

        <TextArea
          name="motivation.selfPR"
          label="Self PR (自己PR)"
          rows={6}
          placeholder="Promote yourself! What are your strengths?"
          helperText="Highlight your key skills, experiences, and personality traits that make you a good fit."
        />
      </div>
    </div>
  );
};
