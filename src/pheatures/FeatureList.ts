import BaseSymbolList from "./BaseSymbolList";
import ComplexSymbol from "./ComplexSymbol";
import Dependency from "./Dependency";
import Diacritics from "./Diacritics";
import FeatureChange from "./FeatureChange";
import { FeatureName } from "./FeatureSpecification";
import Message from "./Message";
import PhonemeInventory from "./PhonemeInventory";

// based on BareFeatureList.java
// Runs search and transformation queries on the phoneme inventory
class FeatureList {
  phonemeInventory: PhonemeInventory;
  // the symbols selected by the search query
  items: ComplexSymbol[];
  // whether or not the selection was transformed
  messages: Message[];

  constructor(
    phonemeInventory: PhonemeInventory,
    // a reference to the full list of symbols to use when performing transformations
    symbolList: BaseSymbolList,
    // a reference to the list of diacritics to use when performing transformations
    diacriticList: Diacritics,
    // a reference to the list of dependencies to use when performing transformations
    dependencies: Dependency[],
    selectQuery: string,
    transformQuery: string
  ) {
    this.phonemeInventory = phonemeInventory;

    // add all symbols in the inventory to the current selection
    this.items = phonemeInventory.symbols.slice();
    this.messages = [];

    this.searchAndTransform(
      FeatureChange.fromQuery(selectQuery),
      FeatureChange.fromQuery(transformQuery),
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

    // select symbols that match the feature values in the selection query
    this.items = this.phonemeInventory.select(query);

    this._checkMinimality(query, transform);

    // // TODO: handle variables with match report
    // this.selection.forEach((symbol, i) => {
    //   if (symbol.matches(query)) {
    //     results.push(i);
    //   }
    // });

    if (runTransform) {
      // get feature changes which would be vacuous
      const redundantChanges = transform.findVacuous(this.items);
      if (!redundantChanges.isNull()) {
        this.messages.push(Message.redundantChange(redundantChanges));
      }

      // apply dependencies to the transformation
      const appliedDependencies = transform.applyDependencies(dependencies);
      if (appliedDependencies.length > 0) {
        this.messages.push(Message.dependency(appliedDependencies));
      }

      // run transformation and reselect items
      this.items = this.items.map((symbol) => {
        return symbol.apply(transform, symbolList, diacriticList);
      });
    }
  }

  // Determines if a feature selection could have been omitted:
  // either the feature does not further constrain the selection
  // or the transformation would be equivalent without the selection
  _checkMinimality(query: FeatureChange, transform: FeatureChange): void {
    // Array of items which would be selected had one of the features in the selection query been removed
    const unconstrainedResult = Object.keys(query.features)
      .map((name) => query.removeFeature(name as FeatureName))
      .map((reducedQuery) => this.phonemeInventory.select(reducedQuery));

    // the selection is minimal if removing any feature change results in a larger selection
    // otherwise, the feature change could be removed for the same result
    const minimal = unconstrainedResult.every((items) => items.length > this.items.length);

    if (!minimal) {
      this.messages.push(Message.notMinimal());
    }

    if (!transform.isNull()) {
      // select symbols for which the transformation would be vacuous
      const transformIdentity = new Set<ComplexSymbol>(this.phonemeInventory.select(transform));
      // hash selected items to look up in redundant selection check
      const resultSet = new Set<ComplexSymbol>(this.items);

      // if the items included by removing a feature are all part of the transformation identity,
      // then including that feature is redundant
      // e.g. selecting -voice and applying +voice could be accomplished without the selection
      const selectionRedundant = unconstrainedResult.some((items) => {
        // select items not part of the end result
        const additionalItems = items.filter((item) => !resultSet.has(item));
        // check if this greater selection are all in the transformation identity
        return additionalItems.every((item) => transformIdentity.has(item));
      });

      if (selectionRedundant) {
        this.messages.push(Message.redundantSelection());
      }
    }
  }
}

export default FeatureList;
