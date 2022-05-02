import React, { useState } from "react";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";

import ComplexSymbol from "pheatures/ComplexSymbol";
import { FeatureName, featureNames } from "pheatures/FeatureSpecification";
import PhonemeInventory from "pheatures/PhonemeInventory";

type Order = "asc" | "desc";

function getComparator(property: FeatureName, order: Order) {
  const c = order === "asc" ? 1 : -1;
  return (a: ComplexSymbol, b: ComplexSymbol) => {
    if (b.features[property] < a.features[property]) {
      return c;
    }
    if (b.features[property] > a.features[property]) {
      return -c;
    }
    return 0;
  };
}

interface SpreadsheetProps {
  phonemeInventory: PhonemeInventory;
}

// Spreadsheet view of features list
// Table design based on Sorting & selecting example for Material UI Table component
// https://mui.com/material-ui/react-table/#sorting-amp-selecting
function Spreadsheet({ phonemeInventory }: SpreadsheetProps) {
  const symbols = phonemeInventory.symbols;
  const rowCount = symbols.length;

  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState<FeatureName>("syllabic");
  const [order, setOrder] = useState<Order>("desc");

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(event.target.checked ? symbols.map((s) => s.displayCharacter) : []);
  };

  const handleSelect = (value: string) => {
    const selectedIndex = selected.indexOf(value);
    // if not selected, insert at end; otherwise, remove the value
    setSelected((selected) =>
      selectedIndex === -1
        ? selected.concat(value)
        : selected.slice(0, selectedIndex).concat(selected.slice(selectedIndex + 1))
    );
  };

  const handleSort = (property: FeatureName) => {
    // if currently ordering by property ascending, switch to descending
    // otherwise, set to descending
    setOrder((order) => (order === "asc" && orderBy === property ? "desc" : "asc"));
    setOrderBy(property);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;
  const numSelected = selected.length;

  // list of symbols sorted by ordering criterion
  const symbolList = symbols.slice().sort(getComparator(orderBy, order));

  return (
    <Paper style={{ width: "100%", maxHeight: "800px", overflow: "scroll" }}>
      <Table stickyHeader>
        <TableHead style={{ fontSize: "12px" }}>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={rowCount > 0 && numSelected === rowCount}
                onChange={handleSelectAll}
                inputProps={{ "aria-label": "select all phonemes" }}
              />
            </TableCell>

            <TableCell>Phoneme</TableCell>

            {featureNames.map((name) => (
              <TableCell key={name} sortDirection={orderBy === name ? order : false}>
                <TableSortLabel
                  active={orderBy === name}
                  direction={orderBy === name ? order : "asc"}
                  onClick={() => handleSort(name)}
                >
                  {name}
                  {orderBy === name && (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc" ? "sorted descending" : "sorted ascending"}
                    </Box>
                  )}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {symbolList.map((symbol, index) => {
            const features = symbol.features;
            const character = symbol.displayCharacter;

            const isItemSelected = isSelected(character);
            const labelId = `spreadsheet-checkbox-${index}`;

            return (
              <TableRow
                key={character}
                hover
                onClick={() => handleSelect(character)}
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                selected={isItemSelected}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={isItemSelected}
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </TableCell>

                <TableCell
                  component="th"
                  id={labelId}
                  scope="row"
                  align="center"
                  padding="none"
                >
                  {character}
                </TableCell>

                {featureNames.map((name) => (
                  <TableCell key={name} align="center">
                    {features[name]}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default Spreadsheet;
