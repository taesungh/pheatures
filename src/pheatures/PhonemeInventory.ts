import BaseSymbolList from "./BaseSymbolList";
import ComplexSymbol from "./ComplexSymbol";
import Diacritics from "./Diacritics";
import FeatureChange from "./FeatureChange";

// based on Inventory.java
class PhonemeInventory {
  symbols: ComplexSymbol[];

  constructor(symbols: ComplexSymbol[]) {
    this.symbols = symbols;
  }

  static fromData(
    inventoryTable: string[][],
    baseSymbols: BaseSymbolList,
    diacriticList: Diacritics
  ) {
    return new PhonemeInventory(
      inventoryTable.map((row) => {
        // extract base symbol and diacritics to apply
        const [character, ...diacriticLabels] = row;
        if (!character) {
          throw new Error("Invalid entry in inventory table.");
        }
        if (!(character in baseSymbols.symbols)) {
          throw new Error(`Character ${character} is not part of base symbols`);
        }
        const baseSymbol = baseSymbols.symbols[character];
        // look up diacritics from list based on label
        const diacritics = diacriticLabels.map((d) => diacriticList.getFromLabel(baseSymbol, d));
        return ComplexSymbol.fromBaseSymbol(baseSymbol, diacritics);
      })
    );
  }

  // selects symbols that match the features of the query
  select(query: FeatureChange): ComplexSymbol[] {
    return this.symbols.filter((symbol) => symbol.matches(query));
  }
}

export default PhonemeInventory;
