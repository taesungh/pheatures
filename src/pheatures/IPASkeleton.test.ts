import { expect, test } from "vitest";

import consonantChartsPath from "@/assets/data/ipa-chart/ipachart-consonants.tsv";

import ComplexSymbol from "./ComplexSymbol";
import { diacriticList } from "./Diacritics";
import IPASkeleton from "./IPASkeleton";
import symbolList from "./SymbolList.test";
import parseFile from "@/utils/dataTransformer";

const consonantsChart = parseFile<Record<string, string>>(consonantChartsPath, true);

// unwrap headers provided by dataTransformer
const rawConsonants = [Array.from(Object.keys(consonantsChart[0]))].concat(
	consonantsChart.map(Object.values)
);
const skeleton = new IPASkeleton(rawConsonants, symbolList);

test("finds reasonable base candidate: aspirated backed velar plosive", async () => {
	const symbol = ComplexSymbol.fromBaseSymbol(symbolList.symbols["k"], [
		diacriticList.getFromName("backed velar"),
		diacriticList.getFromName("aspirated"),
	]);
	const coordinates = skeleton._findCandidate(symbol);
	expect(coordinates).toEqual([1, 11]);
});

test("finds reasonable base candidate: stressed postalveolar plosive", async () => {
	const symbol = ComplexSymbol.fromBaseSymbol(symbolList.symbols["t"], [
		diacriticList.getFromName("postalveolar"),
		diacriticList.getFromName("stressed"),
	]);
	const coordinates = skeleton._findCandidate(symbol);
	expect(coordinates).toEqual([1, 5]);
});
