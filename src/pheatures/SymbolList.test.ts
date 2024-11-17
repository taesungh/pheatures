import { expect, test } from "vitest";

import symbolListPath from "@/assets/data/symbol-list.tsv";
import parseFile from "@/utils/dataTransformer";

import { RawSymbol } from "./BaseSymbol";
import BaseSymbolList from "./BaseSymbolList";

const rawSymbols = parseFile<RawSymbol>(symbolListPath, true);
const symbolList = new BaseSymbolList(rawSymbols);

test("symbol list is loaded properly", () => {
	expect(Object.entries(symbolList.symbols)).toHaveLength(130);
});

export default symbolList;
