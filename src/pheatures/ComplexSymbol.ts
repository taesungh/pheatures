import BaseSymbol from "./BaseSymbol";
import BaseSymbolList from "./BaseSymbolList";
import Diacritic from "./Diacritic";
import FeatureChange from "./FeatureChange";
import FeatureSpecification, { FeatureName, featureNames } from "./FeatureSpecification";

// A ComplexSymbol is a symbol which may have diacritics attached
// These are stored by the PhonemeInventory
class ComplexSymbol extends BaseSymbol {
  // list of diacritics to apply
  diacritics: Diacritic[];
  // chain of transformations, referring to this symbol by default
  antecedent: ComplexSymbol;

  constructor(
    character: string,
    sound: string,
    diacritics: Diacritic[],
    features: FeatureSpecification
  ) {
    super(character, sound, features);
    this.diacritics = diacritics;
    this.antecedent = this;
  }

  static fromBaseSymbol(baseSymbol: BaseSymbol, diacritics: Diacritic[]) {
    return new ComplexSymbol(
      baseSymbol.character,
      baseSymbol.sound,
      diacritics,
      baseSymbol.features
    );
  }

  get displayCharacter() {
    return `${this.character}${this.diacritics.map((diacritic) => diacritic.label).join()}`;
  }

  // check if symbol matches features specified in query
  // cannot match variables
  matches(query: FeatureChange) {
    return Object.entries(query.features).every(
      ([name, value]) => this.features[name as FeatureName] === value
    );
  }

  // Returns a new ComplexSymbol with the transformation applied to this symbol
  // This symbol symbol is added to the antecedent chain of the result
  // The specified symbol list is used to determine the resulting character
  apply(transform: FeatureChange, symbolList: BaseSymbolList) {
    // note that diacritics and features are objects, so the references need to be changed
    const result = new ComplexSymbol(
      // set character to unknown
      "?",
      this.sound,
      // remove diacritics, to be recalculated when determining character
      [],
      // apply transformation features
      { ...this.features, ...transform.features }
    );
    result.antecedent = this;

    result._determineCharacter(symbolList);

    return result;
  }

  _determineCharacter(symbolList: BaseSymbolList) {
    // look for an exact match
    for (const symbol of Object.values(symbolList.symbols)) {
      if (featureNames.every((name) => this.features[name] === symbol.features[name])) {
        this.character = symbol.character;
        return;
      }
    }
    // otherwise, need to try applying diacritics
    // TODO: diacritics
  }
}

export default ComplexSymbol;
