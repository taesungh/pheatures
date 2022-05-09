import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

function Footer() {
  return (
    <footer className="footer">
      <Container maxWidth="xl">
        <Box py={10}>
          <Typography mb={1}>
            Pheatures Spreadsheet Online developed by Taesung Hwang for LSCI 10 at UCI.
          </Typography>
          <Typography>
            This online application is based on{" "}
            <Link href="https://linguistics.ucla.edu/people/hayes/120a/Pheatures/">
              Pheatures Spreadsheet
            </Link>{" "}
            which was originally programmed by{" "}
            <Link href="https://www.florisvanvugt.com">Floris van Vugt</Link> with advice from{" "}
            <Link href="https://linguistics.ucla.edu/people/hayes/">Professor Bruce Hayes</Link> and{" "}
            <Link href="https://linguistics.ucla.edu/people/zuraw/">Professor Kie Zuraw</Link> at
            the UCLA Department of Linguistics. That project improved upon Professor Zuraw&apos;s
            work on FeaturePad from which many of the algorithms are adopted.
          </Typography>
        </Box>
      </Container>
    </footer>
  );
}

export default Footer;
