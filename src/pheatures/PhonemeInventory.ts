import BaseSymbolList from "./BaseSymbolList";
import ComplexSymbol from "./ComplexSymbol";
import Diacritics from "./Diacritics";

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
        const [character, ...diacritics] = row;
        if (!character) {
          throw new Error("Invalid entry in inventory table.");
        }
        if (!(character in baseSymbols.symbols)) {
          throw new Error(`Character ${character} is not part of base symbols`);
        }
        return ComplexSymbol.fromBaseSymbol(
          baseSymbols.symbols[character],
          diacritics.map((diacriticCharacter) => diacriticList.items[diacriticCharacter])
        );
      })
    );
  }
}

export default PhonemeInventory;
