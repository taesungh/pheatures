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
    features: FeatureSpecification,
    diacritics: Diacritic[]
  ) {
    super(character, sound, features);
    this.diacritics = diacritics;
    this.antecedent = this;
    this.compileDiacritics();
  }

  static fromBaseSymbol(baseSymbol: BaseSymbol, diacritics: Diacritic[]) {
    return new ComplexSymbol(
      baseSymbol.character,
      baseSymbol.sound,
      baseSymbol.features,
      diacritics
    );
  }

  get displayCharacter() {
    return `${this.character}${this.diacritics.map((diacritic) => diacritic.label).join()}`;
  }

  // applies the target feature changes of each diacritic to the features of this symbol
  compileDiacritics() {
    this.diacritics.forEach((diacritic) => {
      // update features with those of diacritic
      this.features = { ...this.features, ...diacritic.to.features };
    });
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
      // apply transformation features
      { ...this.features, ...transform.features },
      // remove diacritics, to be recalculated when determining character
      []
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
