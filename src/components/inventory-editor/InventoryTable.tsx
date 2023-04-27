import Button from "@mui/material/Button";
import { cyan } from "@mui/material/colors";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import ComplexSymbol from "pheatures/ComplexSymbol";
import Diacritic from "pheatures/Diacritic";
import IPASkeleton from "pheatures/IPASkeleton";

import "./InventoryTable.css";

interface InventoryTableProps {
	skeleton: IPASkeleton;
	selected: ComplexSymbol[];
	handleSelect: (symbol: ComplexSymbol) => void;
	diacritic: Diacritic | null;
	setDiacritic: React.Dispatch<React.SetStateAction<Diacritic | null>>;
}

function InventoryTable({
	skeleton,
	selected,
	handleSelect,
	diacritic,
	setDiacritic,
}: InventoryTableProps) {
	const applyCustomDiacritic = (symbol: ComplexSymbol): void => {
		if (diacritic) {
			handleSelect(symbol.withDiacritic(diacritic));
		}
		setDiacritic(null);
	};

	const SymbolCell = ({ symbol }: { symbol: ComplexSymbol }) => {
		if (diacritic) {
			const canApply =
				symbol.matches(diacritic.from) && !symbol.diacritics.includes(diacritic);

			if (!canApply) {
				// TODO: more specific error message
				const tooltip = `This diacritic cannot be applied because it requires the base symbol to be ${diacritic.from}`;
				return (
					<TableCell align="center" padding="none">
						<Tooltip title={tooltip}>
							<span>
								<Button disabled sx={{ textTransform: "none" }}>
									<Typography variant="phoneme">{symbol.displayCharacter}</Typography>
								</Button>
							</span>
						</Tooltip>
					</TableCell>
				);
			}

			return (
				<TableCell align="center" padding="none">
					<Button
						onClick={() => applyCustomDiacritic(symbol)}
						sx={{ textTransform: "none" }}
					>
						<Typography variant="phoneme">{symbol.displayCharacter}</Typography>
					</Button>
				</TableCell>
			);
		}

		return (
			<TableCell
				align="center"
				// :has selector is not supported in Firefox :(
				padding="none"
				sx={{ backgroundColor: selected.includes(symbol) ? cyan[200] : "transparent" }}
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
	};

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
