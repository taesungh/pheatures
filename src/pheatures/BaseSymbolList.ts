import BaseSymbol, { RawSymbol } from "./BaseSymbol";

// Holds the feature data of the base symbols, those without diacritics
class BaseSymbolList {
  symbols: {
    [index: string]: BaseSymbol;
  };

  constructor(rawSymbols: RawSymbol[]) {
    this.symbols = Object.fromEntries(
      rawSymbols.map((rawSymbol) => {
        const symbol = BaseSymbol.fromData(rawSymbol);
        return [symbol.character, symbol];
      })
    );
  }
}

export default BaseSymbolList;
