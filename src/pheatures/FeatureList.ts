import BaseSymbolList from "./BaseSymbolList";
import ComplexSymbol from "./ComplexSymbol";
import Dependency from "./Dependency";
import Diacritics from "./Diacritics";
import FeatureChange from "./FeatureChange";
import PhonemeInventory from "./PhonemeInventory";

// based on BareFeatureList.java
// Runs search and transformation queries on the phoneme inventory
class FeatureList {
  phonemeInventory: PhonemeInventory;
  // the symbols selected by the search query
  items: ComplexSymbol[];
  // whether or not the selection was transformed

  constructor(
    phonemeInventory: PhonemeInventory,
    // a reference to the full list of symbols to use when performing transformations
    symbolList: BaseSymbolList,
    // a reference to the list of diacritics to use when performing transformations
    diacriticList: Diacritics,
    // a reference to the list of dependencies to use when performing transformations
    dependencies: Dependency[],
    query: string,
    transform: string
  ) {
    this.phonemeInventory = phonemeInventory;

    // add all symbols in the inventory to the current selection
    this.items = phonemeInventory.symbols.slice();

    this.searchAndTransform(
      new FeatureChange(query),
      new FeatureChange(transform),
      symbolList,
      diacriticList,
      dependencies
    );
  }

  searchAndTransform(
    query: FeatureChange,
    transform: FeatureChange,
    symbolList: BaseSymbolList,
    diacriticList: Diacritics,
    dependencies: Dependency[]
  ): void {
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
      // apply dependencies to the transformation
      transform.applyDependencies(dependencies);

      // run transformation and reselect items
      this.items = this.items.map((symbol) => {
        return symbol.apply(transform, symbolList, diacriticList);
      });
    }
  }
}

export default FeatureList;
