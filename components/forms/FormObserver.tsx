"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { RirekishoData } from "@/types/resume";

interface FormObserverProps {
  onChange: (data: Partial<RirekishoData>) => void;
}

export const FormObserver = ({ onChange }: FormObserverProps) => {
  const { watch } = useFormContext<RirekishoData>();

  useEffect(() => {
    const subscription = watch((value) => {
      onChange(value as Partial<RirekishoData>);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return null;
};
