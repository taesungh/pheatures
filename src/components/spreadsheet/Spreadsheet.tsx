import React, { useEffect, useMemo, useState } from "react";

import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";

import ComplexSymbol from "pheatures/ComplexSymbol";
import FeatureList from "pheatures/FeatureList";
import {
	FeatureDisplayValues,
	FeatureName,
	featureNames,
} from "pheatures/FeatureSpecification";

import { FeatureComparison } from "components";

const stickyColumn1 = {
	position: "sticky",
	left: 0,
	backgroundColor: "common.white",
};

const stickyColumn2 = {
	position: "sticky",
	left: "46px",
	padding: "4px 1rem",
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
	const antecedents = useMemo(
		() => symbols.map((symbol) => symbol.antecedent),
		[symbols]
	);
	const rowCount = symbols.length;

	const [selected, setSelected] = useState<ComplexSymbol[]>([]);
	const [orderBy, setOrderBy] = useState<FeatureName>("syllabic");
	const [order, setOrder] = useState<Order>("desc");
	const [compareDialogOpen, setCompareDialogOpen] = useState<boolean>(false);
	const [compareMode, setCompareMode] = useState<"common" | "diff">("common");

	useEffect(() => {
		// when feature list items are modified, remove selection items that are no longer included
		setSelected((selected) => selected.filter((symbol) => antecedents.includes(symbol)));
	}, [antecedents]);

	const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSelected(event.target.checked ? antecedents : []);
	};

	const handleSelect = (value: ComplexSymbol) => {
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

	const isSelected = (symbol: ComplexSymbol) => selected.indexOf(symbol) !== -1;
	const numSelected = selected.length;

	// list of symbols sorted by ordering criterion
	const symbolList = symbols.slice().sort(getComparator(orderBy, order));

	const titleToolbar = (
		<Toolbar>
			<Typography variant="h6" component="div">
				Feature List
			</Typography>
		</Toolbar>
	);

	const closeCompareDialog = () => {
		setCompareDialogOpen(false);
	};

	const openDiff = () => {
		setCompareMode("diff");
		setCompareDialogOpen(true);
	};

	const openCommon = () => {
		setCompareMode("common");
		setCompareDialogOpen(true);
	};

	// comparison must compare transformed symbols
	// select, in order, the transformed symbols which are part of the selection
	const comparisonSymbols = symbols.filter((symbol) =>
		selected.includes(symbol.antecedent)
	);

	const operationToolbar = (
		<Toolbar
			sx={{
				bgcolor: (theme) =>
					alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
			}}
		>
			<Typography sx={{ flex: "1 1 100%" }} color="inherit" component="div">
				{numSelected} selected
			</Typography>
			<Stack direction="row" spacing={1}>
				<Tooltip title="Find difference in features">
					<Button variant="contained" onClick={openDiff}>
						Diff
					</Button>
				</Tooltip>
				<Tooltip title="Find common features">
					<Button variant="contained" onClick={openCommon}>
						Common
					</Button>
				</Tooltip>
			</Stack>
		</Toolbar>
	);

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

				const isItemSelected = isSelected(symbol.antecedent);
				const undeterminedLabel = symbol.displayCharacter === "?";
				const labelId = `spreadsheet-checkbox-${index}`;

				return (
					<TableRow
						key={antecedentCharacter}
						hover
						onClick={() => handleSelect(symbol.antecedent)}
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
								{symbol.antecedent !== symbol &&
									`${symbol.antecedent.displayCharacter} \u2192 `}
								{undeterminedLabel ? (
									<Button
										variant="contained"
										color="warning"
										disableElevation
										disabled
										sx={{ padding: "0 8px", minWidth: 0 }}
									>
										<Typography variant="phoneme">{symbol.displayCharacter}</Typography>
									</Button>
								) : (
									symbol.displayCharacter
								)}
							</Typography>
						</TableCell>

						{featureNames.map((name) => (
							<TableCell key={name} align="center" padding="none">
								<Typography variant="featureValue">
									{FeatureDisplayValues[symbol.features[name]]}
								</Typography>
							</TableCell>
						))}
					</TableRow>
				);
			})}
		</TableBody>
	);

	return (
		<Box>
			{numSelected > 0 ? operationToolbar : titleToolbar}
			<TableContainer
				sx={{ maxHeight: "60vh", borderTop: "1px solid rgba(224, 224, 224, 1)" }}
			>
				<Table stickyHeader sx={{ whiteSpace: "nowrap" }}>
					{tableHead}
					{tableBody}
				</Table>
			</TableContainer>
			<FeatureComparison
				open={compareDialogOpen}
				symbols={comparisonSymbols}
				mode={compareMode}
				handleClose={closeCompareDialog}
			/>
		</Box>
	);
}

export default Spreadsheet;
