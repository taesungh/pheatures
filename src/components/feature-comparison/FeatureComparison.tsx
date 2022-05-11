import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import { commonFeatures, differentFeatures } from "pheatures/Compare";
import ComplexSymbol from "pheatures/ComplexSymbol";
import { FeatureDisplayExplicit } from "pheatures/FeatureSpecification";

const stickyColumn1 = {
  position: "sticky",
  left: 0,
  backgroundColor: "common.white",
  borderRight: "1px solid rgba(224, 224, 224, 1)",
  boxShadow: "12px 0px 16px rgba(0, 0, 0, 0.05)",
};

interface FeatureComparisonProps {
  open: boolean;
  symbols: ComplexSymbol[];
  mode: "common" | "diff";
  handleClose: () => void;
}

function FeatureComparison({ open, symbols, mode, handleClose }: FeatureComparisonProps) {
  const compareAction = { common: commonFeatures, diff: differentFeatures }[mode];
  const result = compareAction(symbols);

  return (
    <Dialog open={open} maxWidth={"xl"} onClose={handleClose}>
      <DialogTitle>{{ common: "Common", diff: "Different" }[mode]} Features</DialogTitle>
      <TableContainer sx={{ borderTop: "1px solid rgba(224, 224, 224, 1)" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={stickyColumn1}>
                Phoneme
              </TableCell>
              {result.map((featureName) => (
                <TableCell key={featureName} align="center">
                  {featureName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {symbols.map((symbol) => (
              <TableRow key={symbol.antecedent.displayCharacter}>
                <TableCell align="center" sx={stickyColumn1}>
                  <Typography variant="phoneme">{symbol.displayCharacter}</Typography>
                </TableCell>
                {result.map((featureName) => (
                  <TableCell key={featureName} align="center">
                    <Typography variant="featureValue">
                      {FeatureDisplayExplicit[symbol.features[featureName]]}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default FeatureComparison;
