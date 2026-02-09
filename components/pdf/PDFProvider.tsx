"use client";

import dynamic from "next/dynamic";
import { RirekishoData } from "@/types/resume";
import { RirekishoDocument } from "./RirekishoDocument";

// Import PDFViewer dynamically to avoid server-side rendering issues
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        Loading PDF Viewer...
      </div>
    ),
  },
);

interface PDFProviderProps {
  data: RirekishoData;
}

export const PDFProvider = ({ data }: PDFProviderProps) => {
  return (
    <div className="w-full h-full border rounded-lg overflow-hidden">
      <PDFViewer width="100%" height="100%" className="w-full h-full">
        <RirekishoDocument data={data} />
      </PDFViewer>
    </div>
  );
};
