import { useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Tab from "@mui/material/Tab";
import TableContainer from "@mui/material/TableContainer";
import Tabs from "@mui/material/Tabs";

import consonantsChart from "assets/data/ipa-chart/ipachart-consonants.tsv";
import vowelsChart from "assets/data/ipa-chart/ipachart-vowels.tsv";

import BaseSymbolList from "pheatures/BaseSymbolList";
import ComplexSymbol from "pheatures/ComplexSymbol";
import useIPASkeleton from "services/useIPASkeleton";

import InventoryTable from "./InventoryTable";

interface InventoryEditorProps {
  open: boolean;
  symbolList: BaseSymbolList;
  symbols: ComplexSymbol[];
  applyInventory: () => void;
  handleClose: () => void;
}

const tableTabs = ["consonants", "vowels"] as const;
type TableTabs = typeof tableTabs[number];

function InventoryEditor({
  open,
  symbolList,
  symbols,
  applyInventory,
  handleClose,
}: InventoryEditorProps) {
  const [selectedTab, setSelectedTab] = useState<TableTabs>("consonants");

  const consonants = useIPASkeleton(consonantsChart, symbolList, symbols);
  const vowels = useIPASkeleton(vowelsChart, symbolList, symbols);

  if (consonants.loading || vowels.loading) {
    return null;
  }

  const consonantsInventoryTable = <InventoryTable {...consonants} />;
  const vowelsInventoryTable = <InventoryTable {...vowels} />;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg">
      <DialogTitle>Edit Phoneme Inventory</DialogTitle>
      <Tabs value={selectedTab} onChange={(e, v) => setSelectedTab(v)}>
        <Tab label="consonants" value="consonants" />
        <Tab label="vowels" value="vowels" />
      </Tabs>
      <TableContainer>
        {selectedTab === "consonants" && consonantsInventoryTable}
        {/* {otherTable} */}
        {selectedTab === "vowels" && vowelsInventoryTable}
      </TableContainer>
      <DialogActions>
        <Button onClick={applyInventory}>Apply</Button>
      </DialogActions>
    </Dialog>
  );
}

export default InventoryEditor;
