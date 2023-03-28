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

  const [selected, setSelected] = useState<ComplexSymbol[]>(symbols);

  const consonantTable = useIPASkeleton(consonantsChart, symbolList);
  const vowelTable = useIPASkeleton(vowelsChart, symbolList);

  if (consonantTable.skeleton.length === 0 || vowelTable.skeleton.length === 0) {
    return null;
  }

  const handleSelect = (symbol: ComplexSymbol) => {
    // if not selected, insert at end; otherwise, remove the value
    setSelected((selected) => {
      const selectedIndex = selected.indexOf(symbol);
      return selectedIndex === -1
        ? selected.concat(symbol)
        : selected.slice(0, selectedIndex).concat(selected.slice(selectedIndex + 1));
    });
  };

  const consonantsInventoryTable = (
    <InventoryTable ipaSkeleton={consonantTable} selected={selected} handleSelect={handleSelect} />
  );

  const vowelsInventoryTable = (
    <InventoryTable ipaSkeleton={vowelTable} selected={selected} handleSelect={handleSelect} />
  );

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
