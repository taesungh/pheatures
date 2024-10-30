import { CONS, DIA, VOW } from "@/utils/phonemes";

import BaseSymbolList from "./BaseSymbolList";
import { commonFeatures, differentFeatures } from "./Compare";
import PhonemeInventory from "./PhonemeInventory";

import rawSymbols from "@/assets/data/symbol-list.tsv";

const symbolList = new BaseSymbolList(rawSymbols);

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
