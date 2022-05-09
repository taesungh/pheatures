import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    phoneme: React.CSSProperties;
    featureValue: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    phoneme?: React.CSSProperties;
    featureValue?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    phoneme: true;
    featureValue: true;
  }
}

const theme = createTheme({
  typography: {
    fontFamily: "Usual, sans-serif;",
    h1: {
      fontSize: "48px",
      fontWeight: 600,
    },
    phoneme: {
      fontFamily: "'Minion 3 Subhead', serif;",
      fontWeight: 500,
      fontSize: "32px",
    },
    featureValue: {
      fontSize: "18px",
      fontWeight: 400,
    }
  },
});

export default theme;
