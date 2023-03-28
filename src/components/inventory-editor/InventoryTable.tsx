import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import ComplexSymbol from "pheatures/ComplexSymbol";
import IPASkeleton from "pheatures/IPASkeleton";

interface InventoryTableProps {
  ipaSkeleton: IPASkeleton;
  selected: ComplexSymbol[];
  handleSelect: (symbol: ComplexSymbol) => void;
}

function InventoryTable({ ipaSkeleton, selected, handleSelect }: InventoryTableProps) {
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

  return (
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          {ipaSkeleton.skeleton[0].map((head) => {
            return <TableCell key={String(head)}>{String(head)}</TableCell>;
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {ipaSkeleton.skeleton.slice(1).map((row, i) => (
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
