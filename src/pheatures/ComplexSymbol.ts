import BaseSymbol from "./BaseSymbol";
import BaseSymbolList from "./BaseSymbolList";
import Diacritic from "./Diacritic";
import { diacriticList } from "./Diacritics";
import FeatureChange from "./FeatureChange";
import FeatureSpecification, { featureNames } from "./FeatureSpecification";

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

  static fromBaseSymbol(baseSymbol: BaseSymbol, diacritics: Diacritic[]): ComplexSymbol {
    return new ComplexSymbol(
      baseSymbol.character,
      baseSymbol.sound,
      baseSymbol.features,
      diacritics
    );
  }

  // attach diacritic mark to the character
  get displayCharacter(): string {
    // TODO: consider variants for displaying below and above
    // heuristic: sort in reverse order of unicode value which places combining characters first
    // e.g. voiceless long vowel: ring before triangular colon
    this.diacritics.sort((a, b) => b.label.charCodeAt(0) - a.label.charCodeAt(0));
    return `${this.character}${this.diacritics.map((diacritic) => diacritic.label).join("")}`;
  }

  // applies the target feature changes of each diacritic to the features of this symbol
  compileDiacritics(): void {
    this.diacritics.forEach((diacritic) => {
      // update features with those of diacritic
      this.features = { ...this.features, ...diacritic.to.features };
    });
  }

  // Returns a new ComplexSymbol with the transformation applied to this symbol
  // This symbol is added to the antecedent chain of the result
  // The specified symbol list is used to determine the resulting character
  apply(transform: FeatureChange, symbolList: BaseSymbolList): ComplexSymbol {
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

    result._determineCharacter(symbolList);

    return result;
  }

  // based on FindLabels.java
  _determineCharacter(symbolList: BaseSymbolList): void {
    // array of base symbols in symbol list
    const baseSymbols = Object.values(symbolList.symbols);

    // the recursive algorithm would normally handle an exact match,
    // but affricates may require diacritics on both base characters.
    // the symbol list already contains these labels, so rely on those
    for (const symbol of baseSymbols) {
      if (symbol.matches(this)) {
        this.character = symbol.character;
        // this.diacritics will still be empty since the character contains them
        return;
      }
    }

    // recursively search for potential diacritics to apply
    // the candidate symbol passed in will keep track of the already applied diacritics
    // previous approach: candidate is of type BaseSymbol and an array of used diacritics is passed in
    const tryDiacritics = (candidate: ComplexSymbol): Diacritic[] | null => {
      // if the candidate symbol has the same feature specification as this symbol,
      // then the current set of diacritics works
      if (featureNames.every((name) => this.features[name] === candidate.features[name])) {
        // mark the character of this symbol as that of the candidate symbol
        this.character = candidate.character;
        // return the viable set of diacritics to the original caller
        return candidate.diacritics;
      }

      // try applying each of the diacritics to search for the resulting feature specification
      for (const diacritic of diacriticList.items) {
        // skip diacritics that have already been used
        if (candidate.diacritics.includes(diacritic)) {
          continue;
        }

        // if the diacritic can be applied to the candidate symbol
        // and the result matches the features of this symbol
        // and the current candidate does not already have the resulting features
        if (
          candidate.matches(diacritic.from) &&
          this.matches(diacritic.to) &&
          !candidate.matches(diacritic.to)
        ) {
          // apply the diacritic to the candidate
          const partial = new ComplexSymbol(
            candidate.character,
            candidate.sound,
            // the features will be updated when the constructor calls compileDiacritics
            candidate.features,
            // add the selected diacritic to those already applied
            candidate.diacritics.concat([diacritic])
          );
          // continue searching: check if this new candidate could result in matching features
          const res = tryDiacritics(partial);
          // if this produces the desired result, propagate this Array of diacritics
          if (res !== null) {
            return res;
          }
          // otherwise, try the next available diacritic
        }
      }

      // no combination of diacritics applied to the candidate yield the features of this symbol
      return null;
    };

    // start with the bare antecedent symbol (without diacritics)
    // otherwise, the same resulting features may be found on a different base character
    // e.g. fronted velar plosive (k_+) is equivalent to palatalized uvular plosive (q^j)
    // The result is still a heuristic since there may be other ways to represent the same features
    const baseSymbol = symbolList.symbols[this.antecedent.character];
    const choices = [baseSymbol, ...baseSymbols].map((symbol) =>
      ComplexSymbol.fromBaseSymbol(symbol, [])
    );

    // try using each base symbol as the base
    for (const symbol of choices) {
      const res = tryDiacritics(symbol);
      // if trial succeeds, use the result
      if (res !== null) {
        this.diacritics = res;
        return;
      }
      // otherwise, try next choice
    }

    // none of the potential base symbols and diacritics could be matched to these features

    // TODO: find neighbors
  }
}

export default ComplexSymbol;
