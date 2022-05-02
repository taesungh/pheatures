import BaseSymbolList from "./BaseSymbolList";
import ComplexSymbol from "./ComplexSymbol";
import Diacritics from "./Diacritics";

// based on Inventory.java
class PhonemeInventory {
  symbols: ComplexSymbol[];

  constructor(inventoryTable: string[][], baseSymbols: BaseSymbolList, diacriticList: Diacritics) {
    this.symbols = inventoryTable.map((row) => {
      // extract base symbol and diacritics to apply
      const [character, ...diacritics] = row;
      if (!character) {
        throw new Error("Invalid entry in inventory table.");
      }
      return new ComplexSymbol(
        baseSymbols.symbols[character],
        diacritics.map((diacriticCharacter) => diacriticList.items[diacriticCharacter])
      );
    });
  }
}

export default PhonemeInventory;
