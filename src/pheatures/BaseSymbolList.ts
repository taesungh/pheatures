import BaseSymbol, { RawSymbol } from "./BaseSymbol";

// Holds the feature data of the base symbols, those without diacritics
class BaseSymbolList {
	// TODO: consider changing to Map
	// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
	symbols: {
		[index: string]: BaseSymbol;
	};

	constructor(rawSymbols: RawSymbol[]) {
		this.symbols = Object.fromEntries(
			rawSymbols.map((rawSymbol) => {
				const symbol = BaseSymbol.fromData(rawSymbol);
				// labels map to BaseSymbols
				return [symbol.character, symbol];
			})
		);
	}

	isEmpty(): boolean {
		return Object.entries(this.symbols).length === 0;
	}
}

export default BaseSymbolList;
