import BaseSymbol from "./BaseSymbol";
import BaseSymbolList from "./BaseSymbolList";
import Diacritic from "./Diacritic";
import Diacritics from "./Diacritics";
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
  // This symbol is added to the antecedent chain of the result
  // The specified symbol list is used to determine the resulting character
  apply(transform: FeatureChange, symbolList: BaseSymbolList, diacriticList: Diacritics) {
    // note that diacritics and features are objects, so the references need to be changed
    const result = new ComplexSymbol(
      // set character to unknown, to be redetermined when diacritics are applied
      "?",
      this.sound,
      // apply transformation features
      { ...this.features, ...transform.features },
      // remove diacritics, to be recomputed when determining character
      []
    );
    result.antecedent = this;

    result._determineCharacter(symbolList, diacriticList);

    return result;
  }

  // based on FindLabels.java
  _determineCharacter(symbolList: BaseSymbolList, diacriticList: Diacritics) {
    // array of base symbols in symbol list
    const baseSymbols = Object.values(symbolList.symbols);

    // recursively search for potential diacritics to apply
    const tryDiacritics = (base: BaseSymbol, used: Diacritic[]): Diacritic[] | null => {
      // if the base symbol has the same features as this symbol, the current set of diacritics works
      if (featureNames.every((name) => this.features[name] === base.features[name])) {
        // mark the character of this symbol
        this.character = base.character;
        return used;
      }

      for (const diacritic of Object.values(diacriticList.items)) {
        // skip diacritics that have already been used
        if (used.includes(diacritic)) {
          continue;
        }

        // if the diacritic can be applied to the base symbol
        // and the result matches the features of this symbol
        if (base.matches(diacritic.from) && this.matches(diacritic.to)) {
          // search on the character formed by applying the diacritic to the base
          const partial = new ComplexSymbol(
            base.character,
            base.sound,
            // the features will be updated when the constructor calls compileDiacritics
            base.features,
            used.concat([diacritic])
          );
          const res = tryDiacritics(partial, used.concat([diacritic]));
          if (res !== null) {
            return res;
          }
        }
      }
      return null;
    };

    // start with the BaseSymbol described by the antecedent character
    // otherwise, the same resulting features may be found on a different base character
    // e.g. front velar plosive (k_+) is equivalent to palatalized uvular plosive (q^j)
    const startSymbol = symbolList.symbols[this.antecedent.character];

    // try using each base symbol as the base
    for (const symbol of [startSymbol].concat(baseSymbols)) {
      const res = tryDiacritics(symbol, []);
      if (res !== null) {
        this.diacritics = res;
        return;
      }
    }

    // TODO: find neighbors
  }
}

export default ComplexSymbol;
