import { useState } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { InventorySelector, Messages, SelectFeatures, Spreadsheet } from "components";

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

  if (Object.entries(symbolList.symbols).length === 0) {
    return null;
  }

  const inventorySelector = (
    <Paper>
      <Box padding={2}>
        <InventorySelector
          symbolList={symbolList}
          diacritics={diacritics}
          phonemeInventory={inventory}
          symbols={symbols}
          setSymbols={setSymbols}
        />
      </Box>
    </Paper>
  );

  const querySelector = (
    <Paper>
      <Box padding={2}>
        <Typography variant="h6" component="div">
          Select Features
        </Typography>
        <SelectFeatures setQuery={setSearchQuery} />
      </Box>
    </Paper>
  );

  const transformSelector = (
    <Paper>
      <Box padding={2}>
        <Typography variant="h6" component="div">
          Transform Features
        </Typography>
        <SelectFeatures setQuery={setTransformQuery} />
      </Box>
    </Paper>
  );

  const spreadsheet = (
    <Paper>
      <Spreadsheet featureList={featureList} />
    </Paper>
  );

  return (
    <Grid container spacing={3} py={5}>
      <Grid item xs={12}>
        {inventorySelector}
      </Grid>

      <Grid item xs={12}>
        <Messages messages={featureList.messages} />
      </Grid>

      {symbols.length > 0 && (
        <>
          <Grid item xs={12} sm={6}>
            {querySelector}
          </Grid>
          <Grid item xs={12} sm={6}>
            {transformSelector}
          </Grid>
          <Grid item xs={12}>
            {spreadsheet}
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default Pheatures;
