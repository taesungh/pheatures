import React, { useEffect, useState } from "react";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";

import BaseSymbolList from "pheatures/BaseSymbolList";
import ComplexSymbol from "pheatures/ComplexSymbol";
import Diacritics from "pheatures/Diacritics";
import PhonemeInventory from "pheatures/PhonemeInventory";
import useFileData from "utils/useFileData";

import inventories from "assets/data/phoneme-inventories";

interface InventoryEditorProps {
  symbolList: BaseSymbolList;
  diacritics: Diacritics;
  phonemeInventory: PhonemeInventory;
  symbols: ComplexSymbol[];
  setSymbols: React.Dispatch<React.SetStateAction<ComplexSymbol[]>>;
}

function InventoryEditor({ symbolList, diacritics, symbols, setSymbols }: InventoryEditorProps) {
  const [file, setFile] = useState<File | string>();
  const fileData = useFileData<string[]>(file, { delimiter: "\t" });
  const [fileError, setFileError] = useState<boolean>(false);

  // when fileData changes, process the data into a PhonemeInventory
  // call setSymbols with the symbols of the inventory
  useEffect(() => {
    try {
      const inventory = PhonemeInventory.fromData(fileData, symbolList, diacritics);
      setSymbols(inventory.symbols);
    } catch (error) {
      console.warn(error);
      setFileError(true);
    }
  }, [fileData, symbolList, diacritics, setSymbols]);

  const [inventoryName, setInventoryName] = useState<string>("");

  const handleSelectInventory = (event: React.ChangeEvent<HTMLInputElement>) => {
    // update the selection value
    setInventoryName(event.target.value);
    // set the file path which will update fileData which will trigger the previous effect
    setFile(event.target.value);
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];
      setFileError(false);
      setFile(file);
      // set the selection to the name of the file
      setInventoryName(file.name);
    }
  };

  const fileUploaded = typeof file === "object";

  return (
    <Stack direction="row" alignItems="center" justifyContent="center" spacing={3}>
      <TextField
        value={inventoryName}
        onChange={handleSelectInventory}
        select
        id="inventory-select"
        label="Phoneme Inventory"
        // change color if uploaded rather than selected
        inputProps={{ sx: { color: fileUploaded && !fileError ? "info.dark" : "common.black" } }}
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
      </TextField>

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

export default InventoryEditor;
