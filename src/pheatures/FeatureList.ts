import BaseSymbolList from "./BaseSymbolList";
import ComplexSymbol from "./ComplexSymbol";
import FeatureChange from "./FeatureChange";
import PhonemeInventory from "./PhonemeInventory";

// based on BareFeatureList.java
// Runs search and transformation queries on the phoneme inventory
class FeatureList {
  phonemeInventory: PhonemeInventory;
  // a reference to the full list of symbols to use when performing transformations
  symbolList: BaseSymbolList;
  // the symbols selected by the search query
  items: ComplexSymbol[];
  // whether or not the selection was transformed

  constructor(
    phonemeInventory: PhonemeInventory,
    symbolList: BaseSymbolList,
    query: string,
    transform: string
  ) {
    this.phonemeInventory = phonemeInventory;
    this.symbolList = symbolList;

    // add all symbols in the inventory to the current selection
    this.items = phonemeInventory.symbols.slice();

    this.searchAndTransform(new FeatureChange(query), new FeatureChange(transform));
  }

  searchAndTransform(query: FeatureChange, transform: FeatureChange) {
    const runTransform = !transform.isNull();

    // select symbols that match the feature changes in the selection query
    this.items = this.phonemeInventory.symbols.filter((symbol) => symbol.matches(query));

    // // TODO: handle variables with match report
    // this.selection.forEach((symbol, i) => {
    //   if (symbol.matches(query)) {
    //     results.push(i);
    //   }
    // });

    if (runTransform) {
      // run transformation
      this.items.forEach((symbol) => {
        // TODO: dependencies
        // transform.apply(dependencies)
        symbol.apply(transform, this.symbolList);
      });
    }
  }
}

export default FeatureList;
