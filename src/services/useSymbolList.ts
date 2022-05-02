import rawSymbolList from "assets/data/symbol-list.tsv";

import { RawSymbol } from "pheatures/BaseSymbol";
import BaseSymbolList from "pheatures/BaseSymbolList";

import useFileData from "utils/useFileData";

function useSymbolList() {
  const symbolList = useFileData<RawSymbol>(rawSymbolList, { header: true });
  return new BaseSymbolList(symbolList);
}

export default useSymbolList;
