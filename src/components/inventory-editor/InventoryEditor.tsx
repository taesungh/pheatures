import { useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Tab from "@mui/material/Tab";
import TableContainer from "@mui/material/TableContainer";
import Tabs from "@mui/material/Tabs";

import consonantsChart from "@/assets/data/ipa-chart/ipachart-consonants.tsv";
import otherChart from "@/assets/data/ipa-chart/ipachart-other.tsv";
import vowelsChart from "@/assets/data/ipa-chart/ipachart-vowels.tsv";

import BaseSymbolList from "@/pheatures/BaseSymbolList";
import ComplexSymbol from "@/pheatures/ComplexSymbol";
import Diacritic from "@/pheatures/Diacritic";
import useIPASkeleton from "@/services/useIPASkeleton";

import DiacriticSelector from "./DiacriticSelector";
import InventoryTable from "./InventoryTable";

interface InventoryEditorProps {
	open: boolean;
	symbolList: BaseSymbolList;
	symbols: ComplexSymbol[];
	applyInventory: (symbols: ComplexSymbol[]) => void;
	handleClose: () => void;
}

type TableTabs = "consonants" | "other" | "vowels";

function InventoryEditor({
	open,
	symbolList,
	symbols,
	applyInventory,
	handleClose,
}: InventoryEditorProps) {
	const [selectedTab, setSelectedTab] = useState<TableTabs>("consonants");

	const consonants = useIPASkeleton(consonantsChart, symbolList, symbols);
	const other = useIPASkeleton(otherChart, symbolList, symbols);
	const vowels = useIPASkeleton(vowelsChart, symbolList, symbols);

	const [diacritic, setDiacritic] = useState<Diacritic | null>(null);

	if (consonants.loading || vowels.loading) {
		return null;
	}

	const applyAndClose = (): void => {
		applyInventory([
			...consonants.collapse(),
			...other.collapse(),
			...vowels.collapse(),
		]);
		handleClose();
	};

	const consonantsInventoryTable = (
		<InventoryTable {...consonants} diacritic={diacritic} setDiacritic={setDiacritic} />
	);
	const otherInventoryTable = (
		<InventoryTable {...other} diacritic={diacritic} setDiacritic={setDiacritic} />
	);
	const vowelsInventoryTable = (
		<InventoryTable {...vowels} diacritic={diacritic} setDiacritic={setDiacritic} />
	);

	return (
		<Dialog open={open} maxWidth="lg">
			<DialogTitle>Edit Phoneme Inventory</DialogTitle>
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs value={selectedTab} onChange={(_, v: TableTabs) => setSelectedTab(v)}>
					<Tab label="consonants" value="consonants" />
					<Tab label="other" value="other" />
					<Tab label="vowels" value="vowels" />
				</Tabs>
			</Box>
			<TableContainer>
				{selectedTab === "consonants" && consonantsInventoryTable}
				{selectedTab === "other" && otherInventoryTable}
				{selectedTab === "vowels" && vowelsInventoryTable}
			</TableContainer>
			<DialogActions>
				<DiacriticSelector diacritic={diacritic} setDiacritic={setDiacritic} />
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={applyAndClose}>Apply</Button>
			</DialogActions>
		</Dialog>
	);
}

export default InventoryEditor;
