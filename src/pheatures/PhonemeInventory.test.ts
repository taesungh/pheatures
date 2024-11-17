import { expect, test } from "vitest";

import inventoryFiles from "@/assets/data/phoneme-inventories/";
import parseFile from "@/utils/dataTransformer";

import PhonemeInventory from "./PhonemeInventory";
import symbolList from "./SymbolList.test";

type InventoryName = keyof typeof inventoryFiles;

const inventories = Object.fromEntries(
	Object.entries(inventoryFiles).map(([name, path]) => {
		const inventoryTable = parseFile<string[]>(path, false);
		return [name, PhonemeInventory.fromData(inventoryTable, symbolList)];
	})
) as Record<InventoryName, PhonemeInventory>;

test("can read inventories", () => {
	const { EnglishNoDiphthongs, HypotheticalLanguage } = inventories;

	expect(EnglishNoDiphthongs.symbols).toHaveLength(38);
	expect(HypotheticalLanguage.symbols).toHaveLength(37);
});

export default inventories;
