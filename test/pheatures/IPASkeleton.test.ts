import { expect, test } from "vitest";

import consonantChartsPath from "@/assets/data/ipa-chart/ipachart-consonants.tsv";
import parseFile from "@/utils/dataTransformer";

import ComplexSymbol from "@/pheatures/ComplexSymbol";
import { diacriticList } from "@/pheatures/Diacritics";
import IPASkeleton from "@/pheatures/IPASkeleton";

import symbolList from "./SymbolList.test";

const consonantsChart = parseFile<string[]>(consonantChartsPath, false);
const skeleton = new IPASkeleton(consonantsChart, symbolList);

test("finds reasonable base candidate: aspirated backed velar plosive", () => {
	const symbol = ComplexSymbol.fromBaseSymbol(symbolList.symbols["k"], [
		diacriticList.getFromName("backed velar"),
		diacriticList.getFromName("aspirated"),
	]);
	const coordinates = skeleton._findCandidate(symbol);
	expect(coordinates).toEqual([1, 11]);
});

test("finds reasonable base candidate: stressed postalveolar plosive", () => {
	const symbol = ComplexSymbol.fromBaseSymbol(symbolList.symbols["t"], [
		diacriticList.getFromName("postalveolar"),
		diacriticList.getFromName("stressed"),
	]);
	const coordinates = skeleton._findCandidate(symbol);
	expect(coordinates).toEqual([1, 5]);
});
