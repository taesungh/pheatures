import { expect, test } from "vitest";

import { CONS, DIA, VOW } from "@/utils/phonemes";

import { commonFeatures, differentFeatures } from "./Compare";
import PhonemeInventory from "./PhonemeInventory";

import symbolList from "./SymbolList.test";

test("can find different features", () => {
	const symbols = [symbolList.symbols[VOW.OMFU], symbolList.symbols[VOW.MCU]];
	expect(differentFeatures(symbols)).toEqual(["front"]);
});

test("can find different features from diacritics", () => {
	const inventory = PhonemeInventory.fromData([["t", DIA.ASPIRATED], ["s"]], symbolList);
	expect(differentFeatures(inventory.symbols)).toEqual([
		"continuant",
		"delayed release",
		"spread gl",
		"strident",
	]);
});

test("can find common features", () => {
	const symbols = [
		symbolList.symbols["s"],
		symbolList.symbols[VOW.MCU],
		symbolList.symbols[CONS.VdVeNa],
	];
	expect(commonFeatures(symbols)).toEqual([
		"stress",
		"long",
		"tap",
		"trill",
		"spread gl",
		"constr gl",
		"labial",
		"round",
		"labiodental",
		"lateral",
	]);
});
