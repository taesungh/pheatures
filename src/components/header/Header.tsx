import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function Header() {
  return (
    <header style={{ textAlign: "center" }}>
      <Box py={10} sx={{ backgroundColor: "primary.dark", color: "common.white" }}>
        <Typography variant="h1">Pheatures Spreadsheet Online</Typography>
      </Box>
    </header>
  );
}

export default Header;
