"use client";

import { FormProvider as HookFormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeSchema } from "@/lib/schemas/resume";
import { RirekishoData } from "@/types/resume";

interface FormProviderProps {
  children: React.ReactNode;
  defaultValues?: Partial<RirekishoData>;
}

export const FormProvider = ({
  children,
  defaultValues,
}: FormProviderProps) => {
  const methods = useForm<RirekishoData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: defaultValues as RirekishoData,
    mode: "onChange",
  });

  return <HookFormProvider {...methods}>{children}</HookFormProvider>;
};
