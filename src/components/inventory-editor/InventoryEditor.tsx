import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Input from "@mui/material/Input";

import ComplexSymbol from "pheatures/ComplexSymbol";
import BaseSymbolList from "pheatures/BaseSymbolList";
import Diacritics from "pheatures/Diacritics";
import PhonemeInventory from "pheatures/PhonemeInventory";
import useFileData from "utils/useFileData";

interface InventoryEditorProps {
  symbolList: BaseSymbolList;
  diacritics: Diacritics;
  phonemeInventory: PhonemeInventory;
  symbols: ComplexSymbol[];
  setSymbols: React.Dispatch<React.SetStateAction<ComplexSymbol[]>>;
}

function InventoryEditor({ symbolList, diacritics, symbols, setSymbols }: InventoryEditorProps) {
  const [file, setFile] = useState<File>();
  const fileData = useFileData<string[]>(file, { delimiter: "\t" });

  useEffect(() => {
    const inventory = PhonemeInventory.fromData(fileData, symbolList, diacritics);
    setSymbols(inventory.symbols);
  }, [fileData, symbolList, diacritics, setSymbols]);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <Box>
      <label htmlFor="inventory-file-upload">
        <Input id="inventory-file-upload" type="file" onChange={handleUpload} />
      </label>
    </Box>
  );
}

export default InventoryEditor;
