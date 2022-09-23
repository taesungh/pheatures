import BaseSymbolList from "./BaseSymbolList";
import ComplexSymbol from "./ComplexSymbol";
import { diacriticList } from "./Diacritics";

type Cell = string | ComplexSymbol;

// Parses IPA Chart files to use for Inventory Editor
// Based on SubSkeleton.java
class IPASkeleton {
  skeleton: Cell[][];

  constructor(rawSkeleton: string[][], symbolList: BaseSymbolList) {
    this.skeleton = rawSkeleton.map((row) =>
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
        return ComplexSymbol.fromBaseSymbol(baseSymbol, diacritics);
      })
    );
  }
}

export default IPASkeleton;
