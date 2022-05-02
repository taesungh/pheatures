import FeatureSpecification, { featureNames, FeatureValue } from "./FeatureSpecification";

export interface RawSymbol {
  [index: string]: string;
}

// A symbol represents one segment and its features
class BaseSymbol {
  character: string;
  sound: string;
  features: FeatureSpecification;

  constructor(character: string, sound: string, features: FeatureSpecification) {
    this.character = character;
    this.sound = sound;
    this.features = features;
  }

  static fromData(rawSymbol: RawSymbol) {
    return new BaseSymbol(
      rawSymbol.Unicode,
      rawSymbol.Sound,
      Object.fromEntries(
        featureNames
          // .filter((name) => name in rawSymbol)
          .map((name) => [name, rawSymbol[name] as FeatureValue])
      ) as FeatureSpecification
    );
  }
}

export default BaseSymbol;
