import consonantsChart from "@/assets/data/ipa-chart/ipachart-consonants.tsv";
import rawSymbols from "@/assets/data/symbol-list.tsv";

import BaseSymbolList from "./BaseSymbolList";
import ComplexSymbol from "./ComplexSymbol";
import { diacriticList } from "./Diacritics";
import IPASkeleton from "./IPASkeleton";

const symbolList = new BaseSymbolList(rawSymbols);
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
