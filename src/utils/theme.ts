import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    phoneme: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    phoneme?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    phoneme: true;
  }
}

const theme = createTheme({
  typography: {
    phoneme: {
      fontFamily: "'Minion 3 Subhead', serif;",
      fontSize: "28px",
    },
  },
});

export default theme;
