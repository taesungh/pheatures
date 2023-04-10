import { useMemo } from "react";

import { RawSymbol } from "pheatures/BaseSymbol";
import BaseSymbolList from "pheatures/BaseSymbolList";
import useFileData from "utils/useFileData";

import rawSymbolList from "assets/data/symbol-list.tsv";

function useSymbolList(): BaseSymbolList {
	// parse the raw symbol data into keyed objects
	const rawSymbols = useFileData<RawSymbol>(rawSymbolList, { header: true });
	return useMemo(() => new BaseSymbolList(rawSymbols), [rawSymbols]);
}

export default useSymbolList;
