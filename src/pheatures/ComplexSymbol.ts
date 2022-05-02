import BaseSymbol from "./BaseSymbol";
import Diacritic from "./Diacritic";


// A ComplexSymbol refers to a BaseSymbol which may have diacritics attached
// These are stored by the PhonemeInventory
class ComplexSymbol {
  base: BaseSymbol;
  diacritics: Diacritic[];
  // featureValues: FeatureChange;

  constructor(baseSymbol: BaseSymbol, diacritics: Diacritic[] = []) {
    this.base = baseSymbol;
    this.diacritics = diacritics;
  }

  get features() {
    return this.base.features;
  }

  get displayCharacter() {
    return `${this.base.character}${this.diacritics.map((diacritic) => diacritic.label).join()}`;
  }
}

export default ComplexSymbol;
