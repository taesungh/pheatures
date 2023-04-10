import React, { useEffect, useState } from "react";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";

import { InventoryEditor } from "components";
import BaseSymbolList from "pheatures/BaseSymbolList";
import ComplexSymbol from "pheatures/ComplexSymbol";
import PhonemeInventory from "pheatures/PhonemeInventory";
import useFileData from "utils/useFileData";

import inventories from "assets/data/phoneme-inventories";

interface InventorySelectorProps {
	symbolList: BaseSymbolList;
	phonemeInventory: PhonemeInventory;
	symbols: ComplexSymbol[];
	setSymbols: React.Dispatch<React.SetStateAction<ComplexSymbol[]>>;
}

function InventorySelector({ symbolList, symbols, setSymbols }: InventorySelectorProps) {
	const [file, setFile] = useState<File | string>();
	const fileData = useFileData<string[]>(file, { delimiter: "\t" });
	const [fileError, setFileError] = useState<boolean>(false);

	const [editorDialogOpen, setEditorDialogOpen] = useState<boolean>(false);

	// when fileData changes, process the data into a PhonemeInventory
	// call setSymbols with the symbols of the inventory
	useEffect(() => {
		try {
			const inventory = PhonemeInventory.fromData(fileData, symbolList);
			setSymbols(inventory.symbols);
		} catch (error) {
			console.warn(error);
			setFileError(true);
		}
	}, [fileData, symbolList, setSymbols]);

	const [inventoryName, setInventoryName] = useState<string>("");

	const handleSelectInventory = (event: React.ChangeEvent<HTMLInputElement>): void => {
		// update the selection value
		setInventoryName(event.target.value);
		// set the file path which will update fileData which will trigger the previous effect
		setFile(event.target.value);
	};

	const handleUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
		if (event.target.files?.length) {
			const file = event.target.files[0];
			setFileError(false);
			setFile(file);
			// set the selection to the name of the file
			setInventoryName(file.name);
		}
	};

	const openEditor = () => {
		setEditorDialogOpen(true);
	};

	const closeEditor = () => {
		setEditorDialogOpen(false);
	};

	// use the symbols provided when applying the inventory
	const handleEdit = (symbols: ComplexSymbol[]): void => {
		setSymbols(symbols);
		// remove file to allow reselecting the original inventory
		setFile(undefined);
		setInventoryName("custom");
	};

	const fileUploaded = typeof file === "object";
	const customInventory = inventoryName === "custom";

	return (
		<Stack direction="row" alignItems="center" justifyContent="center" spacing={3}>
			<TextField
				value={inventoryName}
				onChange={handleSelectInventory}
				select
				id="inventory-select"
				label="Phoneme Inventory"
				// change color if uploaded or edited rather than selected
				inputProps={{
					sx: {
						color: (fileUploaded && !fileError) || customInventory ? "info.dark" : "common.black",
					},
				}}
				sx={{ width: "20rem" }}
				error={fileError}
				helperText={fileError && "The file you uploaded could not be processed."}
			>
				{Object.entries(inventories).map(([name, path]) => (
					<MenuItem key={name} value={path}>
						{name}
					</MenuItem>
				))}
				{fileUploaded && <MenuItem value={file.name}>{file.name} (uploaded)</MenuItem>}
				{customInventory && <MenuItem value="custom">custom</MenuItem>}
			</TextField>

			<Tooltip title="Edit the phoneme inventory">
				<Button startIcon={<EditRoundedIcon />} onClick={openEditor}>
					Edit
				</Button>
			</Tooltip>
			{editorDialogOpen && (
				<InventoryEditor
					open={editorDialogOpen}
					symbolList={symbolList}
					symbols={symbols}
					applyInventory={handleEdit}
					handleClose={closeEditor}
				/>
			)}

			<label htmlFor="inventory-file-upload">
				<Input
					id="inventory-file-upload"
					type="file"
					onChange={handleUpload}
					sx={{ display: "none" }}
				/>
				<Button startIcon={<FileUploadRoundedIcon />} component="span">
					Upload
				</Button>
			</label>
		</Stack>
	);
}

export default InventorySelector;
