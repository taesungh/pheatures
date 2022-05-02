import BaseSymbol, { RawSymbol } from "./BaseSymbol";

// Holds the feature data of the base symbols, those without diacritics
class BaseSymbolList {
  symbols: BaseSymbol[];

  constructor(rawSymbols: RawSymbol[]) {
    this.symbols = rawSymbols.map((rawSymbol) => new BaseSymbol(rawSymbol));
  }
}

export default BaseSymbolList;
