import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import ComplexSymbol from "pheatures/ComplexSymbol";
import IPASkeleton from "pheatures/IPASkeleton";

interface InventoryTableProps {
  skeleton: IPASkeleton;
  selected: ComplexSymbol[];
  handleSelect: (symbol: ComplexSymbol) => void;
}

function InventoryTable({ skeleton, selected, handleSelect }: InventoryTableProps) {
  const SymbolCell = ({ symbol }: { symbol: ComplexSymbol }) => (
    <TableCell>
      <label>
        <input
          type="checkbox"
          checked={selected.includes(symbol)}
          onChange={() => handleSelect(symbol)}
        />
        <span>{symbol.displayCharacter}</span>
      </label>
    </TableCell>
  );

  return (
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          {skeleton.cells[0].map((head) => {
            return <TableCell key={String(head)}>{String(head)}</TableCell>;
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {skeleton.cells.slice(1).map((row, i) => (
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
}

export default InventoryTable;
