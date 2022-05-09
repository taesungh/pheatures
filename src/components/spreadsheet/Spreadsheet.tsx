import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";

import ComplexSymbol from "pheatures/ComplexSymbol";
import FeatureList from "pheatures/FeatureList";
import { FeatureName, featureNames } from "pheatures/FeatureSpecification";

const stickyColumn1 = {
  position: "sticky",
  left: 0,
  backgroundColor: "common.white",
};

const stickyColumn2 = {
  position: "sticky",
  left: "46px",
  padding: "0 1rem",
  backgroundColor: "common.white",
  borderRight: "1px solid rgba(224, 224, 224, 1)",
  boxShadow: "12px 0px 16px rgba(0, 0, 0, 0.1)",
};

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
  featureList: FeatureList;
}

// Spreadsheet view of features list
// Table design based on Sorting & selecting example for Material UI Table component
// https://mui.com/material-ui/react-table/#sorting-amp-selecting
function Spreadsheet({ featureList }: SpreadsheetProps) {
  const symbols = featureList.items;
  const rowCount = symbols.length;

  const [selected, setSelected] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState<FeatureName>("syllabic");
  const [order, setOrder] = useState<Order>("desc");

  useEffect(() => {
    // when feature list items are modified, remove selection items that are no longer included
    const baseCharacters = symbols.map((symbol) => symbol.antecedent.displayCharacter);
    setSelected((selected) => selected.filter((character) => baseCharacters.includes(character)));
  }, [symbols]);

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

  const tableHead = (
    <TableHead style={{ fontSize: "12px" }}>
      <TableRow>
        <TableCell padding="checkbox" sx={{ zIndex: 3, ...stickyColumn1 }}>
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={handleSelectAll}
            inputProps={{ "aria-label": "select all phonemes" }}
          />
        </TableCell>

        <TableCell align="center" sx={{ zIndex: 3, ...stickyColumn2 }}>
          Phoneme
        </TableCell>

        {featureNames.map((name) => (
          <TableCell
            key={name}
            sortDirection={orderBy === name ? order : false}
            sx={{ padding: "3px 3px 3px 12px" }}
          >
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
  );

  const tableBody = (
    <TableBody>
      {symbolList.map((symbol, index) => {
        // antecedent will refer to self if the symbol is not transformed
        // transformation is not one-to-one, so use antecedent character as unique key
        const antecedentCharacter = symbol.antecedent.displayCharacter;

        const isItemSelected = isSelected(antecedentCharacter);
        const labelId = `spreadsheet-checkbox-${index}`;

        return (
          <TableRow
            key={antecedentCharacter}
            hover
            onClick={() => handleSelect(antecedentCharacter)}
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            selected={isItemSelected}
          >
            <TableCell padding="checkbox" sx={stickyColumn1}>
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
              sx={stickyColumn2}
            >
              <Typography variant="phoneme" component="span">
                {/* if transformed, display antecedent, rightarrow, transformed character */}
                {symbol.antecedent !== symbol && `${symbol.antecedent.displayCharacter} \u2192 `}
                {symbol.displayCharacter}
              </Typography>
            </TableCell>

            {featureNames.map((name) => (
              <TableCell key={name} align="center">
                {symbol.features[name]}
              </TableCell>
            ))}
          </TableRow>
        );
      })}
    </TableBody>
  );

  return (
    <Paper>
      <TableContainer sx={{ maxHeight: "60vh" }}>
        <Table stickyHeader sx={{ whiteSpace: "nowrap" }}>
          {tableHead}
          {tableBody}
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default Spreadsheet;
