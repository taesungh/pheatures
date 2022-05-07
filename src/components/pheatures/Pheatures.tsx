import { useState } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { InventoryEditor, SelectFeatures, Spreadsheet } from "components";

import ComplexSymbol from "pheatures/ComplexSymbol";
import FeatureList from "pheatures/FeatureList";
import useDependencies from "services/useDependencies";
import useDiacritics from "services/useDiacritics";
import usePhonemeInventory from "services/usePhonemeInventory";
import useSymbolList from "services/useSymbolList";


function Pheatures() {
  const symbolList = useSymbolList();
  const diacritics = useDiacritics();
  const dependencies = useDependencies();
  const [symbols, setSymbols] = useState<ComplexSymbol[]>([]);
  const inventory = usePhonemeInventory(symbols);

  const [searchQuery, setSearchQuery] = useState("");
  const [transformQuery, setTransformQuery] = useState("");

  const featureList = new FeatureList(
    inventory,
    symbolList,
    diacritics,
    dependencies,
    searchQuery,
    transformQuery
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <InventoryEditor
          symbolList={symbolList}
          diacritics={diacritics}
          phonemeInventory={inventory}
          symbols={symbols}
          setSymbols={setSymbols}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Paper>
          <Box padding={2}>
            <Typography variant="h6" component="div">
              Select Features
            </Typography>
            <SelectFeatures setQuery={setSearchQuery} />
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Paper>
          <Box padding={2}>
            <Typography variant="h6" component="div">
              Transform Features
            </Typography>
            <SelectFeatures setQuery={setTransformQuery} />
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Spreadsheet featureList={featureList} />
      </Grid>
    </Grid>
  );
}

export default Pheatures;
