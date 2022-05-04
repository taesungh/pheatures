import { useMemo } from "react";

import { RawSymbol } from "pheatures/BaseSymbol";
import BaseSymbolList from "pheatures/BaseSymbolList";
import useFileData from "utils/useFileData";

import rawSymbolList from "assets/data/symbol-list.tsv";

function useSymbolList() {
  const symbolList = useFileData<RawSymbol>(rawSymbolList, { header: true });
  return useMemo(() => new BaseSymbolList(symbolList), [symbolList]);
}

export default useSymbolList;
