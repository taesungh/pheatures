import { useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tabs from "@mui/material/Tabs";

import consonantsChart from "assets/data/ipa-chart/ipachart-consonants.tsv";

import BaseSymbolList from "pheatures/BaseSymbolList";
import ComplexSymbol from "pheatures/ComplexSymbol";
import useIPASkeleton from "services/useIPASkeleton";

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

  if (consonantTable.skeleton.length === 0) {
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

  const SymbolCell = ({ symbol }: { symbol: ComplexSymbol }) => (
    <TableCell>
      <label>
        <input
          type="checkbox"
          checked={selected
            .map((symbol) => symbol.displayCharacter)
            .includes(symbol.displayCharacter)}
          onChange={() => handleSelect(symbol)}
        />
        <span>{symbol.displayCharacter}</span>
      </label>
    </TableCell>
  );

  const consonantsTable = (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>consonant</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {consonantTable.skeleton.map((row, i) => (
          <TableRow key={i}>
            {row.map((cell, j) => {
              if (typeof cell === "string") {
                return <TableCell key={cell || `${i}-${j}`}>{cell}</TableCell>;
              }
              return <SymbolCell key={cell.displayCharacter} symbol={cell} />;
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const vowelsTable = (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>vowel</TableCell>
        </TableRow>
      </TableHead>
    </Table>
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg">
      <DialogTitle>Edit Phoneme Inventory</DialogTitle>
      <Tabs value={selectedTab} onChange={(e, v) => setSelectedTab(v)}>
        <Tab label="consonants" value="consonants" />
        <Tab label="vowels" value="vowels" />
      </Tabs>
      {selectedTab === "consonants" && <TableContainer>{consonantsTable}</TableContainer>}
      {/* {otherTable} */}
      {selectedTab === "vowels" && <TableContainer>{vowelsTable}</TableContainer>}
      <DialogActions>
        <Button onClick={applyInventory}>Apply</Button>
      </DialogActions>
    </Dialog>
  );
}

export default InventoryEditor;
