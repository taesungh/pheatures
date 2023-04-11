import { cyan } from "@mui/material/colors";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import ComplexSymbol from "pheatures/ComplexSymbol";
import IPASkeleton from "pheatures/IPASkeleton";

import "./InventoryTable.css";

interface InventoryTableProps {
	skeleton: IPASkeleton;
	selected: ComplexSymbol[];
	handleSelect: (symbol: ComplexSymbol) => void;
}

function InventoryTable({ skeleton, selected, handleSelect }: InventoryTableProps) {
	const SymbolCell = ({ symbol }: { symbol: ComplexSymbol }) => (
		<TableCell
			align="center"
			// :has selector is not supported in Firefox :(
			sx={{
				padding: 0,
				backgroundColor: selected.includes(symbol) ? cyan[200] : "transparent",
			}}
		>
			<label className="symbolLabel">
				<input
					type="checkbox"
					checked={selected.includes(symbol)}
					onChange={() => handleSelect(symbol)}
				/>
				<Typography variant="phoneme">{symbol.displayCharacter}</Typography>
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
