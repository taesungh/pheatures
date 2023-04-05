import BaseSymbolList from "./BaseSymbolList";
import ComplexSymbol from "./ComplexSymbol";
import { diacriticList } from "./Diacritics";

type Cell = string | ComplexSymbol;

// Parses IPA Chart files to use for Inventory Editor
// Based on SubSkeleton.java
class IPASkeleton {
  cells: Cell[][];
  symbols: ComplexSymbol[];

  constructor(rawSkeleton: string[][], symbolList: BaseSymbolList) {
    this.symbols = [];
    this.cells = rawSkeleton.map((row) =>
      row.map((cell) => {
        cell = cell.trim();

        if (cell === "") {
          return "";
        }

        // Labels are denoted in brackets
        if (cell.startsWith("[") && cell.endsWith("]")) {
          // Use the label
          return cell.slice(1, -1);
        }

        // Otherwise, the cell is a symbol
        const [base, ...diacriticLabels] = cell.split(";");
        if (!(base in symbolList.symbols)) {
          throw new Error(`Skeleton symbol ${base} is not part of the base symbols`);
        }

        // Get the BaseSymbol for the given base character
        const baseSymbol = symbolList.symbols[base];
        // Map diacritic descriptions to their Diacritic objects
        const diacritics = diacriticLabels.map(diacriticList.getFromName.bind(diacriticList));

        const symbol = ComplexSymbol.fromBaseSymbol(baseSymbol, diacritics);
        this.symbols.push(symbol);
        return symbol;
      })
    );
  }

  // Provide equivalent symbols but with references from the skeleton cells
  extract(symbols: ComplexSymbol[]): ComplexSymbol[] {
    if (this.symbols.length === 0) {
      return [];
    }

    const characterMap = new Map(this.symbols.map((symbol) => [symbol.displayCharacter, symbol]));
    const references: ComplexSymbol[] = [];
    for (const symbol of symbols) {
      if (characterMap.has(symbol.displayCharacter)) {
        references.push(characterMap.get(symbol.displayCharacter) as ComplexSymbol);
      } else {
        // TODO: symbol might have additional diacritics or be part of a different table
        // insert new row in table near the matching base symbol?
        console.warn("Initial selection includes an unknown symbol", symbol.displayCharacter);
      }
    }
    return references;
  }

  // Flatten the skeleton cells, keeping only the selected
  // Equivalent to reordering selected symbols based on table ordering
  collapse(selected: ComplexSymbol[]): ComplexSymbol[] {
    const selection = new Set(selected);
    return this.symbols.filter((cell) => typeof cell !== "string" && selection.has(cell));
  }
}

export default IPASkeleton;
