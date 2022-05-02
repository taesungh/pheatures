import FeatureSpecification, { featureNames, FeatureValue } from "./FeatureSpecification";

export interface RawSymbol {
  [index: string]: string;
}

// A symbol represents one segment and its features
class BaseSymbol {
  character: string;
  sound: string;
  features: FeatureSpecification;

  constructor(rawSymbol: RawSymbol) {
    this.character = rawSymbol.Unicode;
    this.sound = rawSymbol.Sound;
    this.features = Object.fromEntries(
      featureNames
        // .filter((name) => name in rawSymbol)
        .map((name) => [name, rawSymbol[name] as FeatureValue])
    ) as FeatureSpecification;
  }
}

export default BaseSymbol;
