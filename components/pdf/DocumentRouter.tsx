import { RirekishoDocument } from "./RirekishoDocument";
import { BioDataDocument } from "./BioDataDocument";
import { RirekishoData } from "@/types/resume";

export const DocumentRouter = ({ data }: { data: RirekishoData }) => {
  // TITP uses Bio-Data style, others use JIS Rirekisho
  if (data.tier === "TITP") {
    return <BioDataDocument data={data} />;
  }

  return <RirekishoDocument data={data} />;
};
