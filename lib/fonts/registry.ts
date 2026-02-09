import { Font } from "@react-pdf/renderer";

const registerFonts = async () => {
  // Register the variable font. Since react-pdf might not fully support variable fonts
  // directly without specifying weights, we map standard weights to the same file.
  // Ideally, we'd have separate static files, but we'll try the variable font.
  // If variable font fails, we might need to use a standard font like Noto Sans JP Regular.
  const fontSrc = "/fonts/NotoSansJP-VariableFont_wght.ttf";

  Font.register({
    family: "NotoSansJP",
    fonts: [
      {
        src: fontSrc,
        fontWeight: 400,
      },
      {
        src: fontSrc,
        fontWeight: 700,
      },
    ],
  });
};

export { registerFonts };
