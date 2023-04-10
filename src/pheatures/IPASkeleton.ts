import BaseSymbolList from "./BaseSymbolList";
import ComplexSymbol from "./ComplexSymbol";
import Diacritic from "./Diacritic";
import { diacriticList } from "./Diacritics";

type Cell = string | ComplexSymbol;

function _subset<T>(a: Iterable<T>, b: Iterable<T>): boolean {
  const sb = new Set(b);
  return Array.from(new Set(a)).every(sb.has.bind(sb));
}

// Parses IPA Chart files to use for Inventory Editor
// Based on SubSkeleton.java
class IPASkeleton {
  cells: Cell[][];
  symbols: ComplexSymbol[];
  diacriticSignature: Set<Diacritic>[];

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
    this.diacriticSignature = [...Array(this.cells.length)].map(() => new Set());
  }

  // Provide equivalent symbols but with references from the skeleton cells
  // Add additional rows with diacritic variants as needed
  initialize(symbols: ComplexSymbol[]): ComplexSymbol[] {
    if (this.symbols.length === 0) {
      return [];
    }

    const characterMap = new Map(this.symbols.map((symbol) => [symbol.displayCharacter, symbol]));
    const references: ComplexSymbol[] = [];

    for (const symbol of symbols) {
      if (characterMap.has(symbol.displayCharacter)) {
        references.push(characterMap.get(symbol.displayCharacter) as ComplexSymbol);
      } else {
        // Symbol might have additional diacritics or be part of a different table
        if (this._insertComplexSymbol(symbol)) {
          references.push(symbol);
        }
      }
    }

    // Update array of all symbol references since new rows may have been added
    this.symbols = this.cells.flat().filter((cell) => typeof cell !== "string") as ComplexSymbol[];
    return references;
  }

  // Based on InventoryTableModel::ensureIncluded
  // Insert a symbol which is not already part of the cells
  // Diacritic Signatures identify additional rows which were not part of the origin skeleton
  // This will make this.symbols stale
  _insertComplexSymbol(symbol: ComplexSymbol): boolean {
    for (let rowIndex = 0; rowIndex < this.cells.length; rowIndex++) {
      const row = this.cells[rowIndex];
      // check if row contains symbol with the same base character and subset of diacritics
      const baseIndex = row.findIndex(
        (cell) =>
          typeof cell !== "string" &&
          cell.character === symbol.character &&
          _subset(cell.diacritics, symbol.diacritics)
      );

      // try next row if matching base not found
      if (baseIndex === -1) {
        continue;
      }

      // check if rows nearby below were already added for this diacritic
      for (let i_candidate = rowIndex + 1; i_candidate < this.cells.length; ++i_candidate) {
        const signature = this.diacriticSignature[i_candidate];
        if (signature.size === 0) {
          // reached a row which was originally part of the skeleton, so a new row needs to be added
          break;
        } else if (_subset(symbol.diacritics, signature) && _subset(signature, symbol.diacritics)) {
          // symbol matches the signature of the candidate row, so place in this row
          this.cells[i_candidate][baseIndex] = symbol;
          return true;
        }
      }

      // insert a new row with the symbol at the correct column
      const newRow: Cell[] = Array(row.length).fill("");
      newRow[baseIndex] = symbol;

      this.cells.splice(rowIndex + 1, 0, newRow);
      this.diacriticSignature.splice(rowIndex + 1, 0, new Set(symbol.diacritics));
      return true;
    }

    // did not find a matching base symbol
    return false;
  }

  // Flatten the skeleton cells, keeping only the selected
  // Equivalent to reordering selected symbols based on table ordering
  collapse(selected: ComplexSymbol[]): ComplexSymbol[] {
    const selection = new Set(selected);
    return this.symbols.filter((cell) => typeof cell !== "string" && selection.has(cell));
  }
}

export default IPASkeleton;
