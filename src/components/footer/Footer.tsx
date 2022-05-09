import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function Footer() {
  return (
    <footer>
      <Box p={10} sx={{ backgroundColor: "grey.900", color: "common.white" }}>
        <Typography>Developed by Taesung Hwang for LSCI 10 at UCI.</Typography>
        <Typography>
          Pheatures Spreadsheet was originally programmed by Floris van Vugt with advice from
          Professor Bruce Hayes and Professor Kie Zuraw at the UCLA Department of Linguistics.
        </Typography>
      </Box>
    </footer>
  );
}

export default Footer;
