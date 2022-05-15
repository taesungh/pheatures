import FeatureChange from "./FeatureChange";
import FeatureSpecification, {
  FeatureName,
  featureNames,
  FeatureValue,
} from "./FeatureSpecification";

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

  // check if symbol matches features specified in query
  // cannot match variables
  matches(query: FeatureChange | BaseSymbol): boolean {
    return Object.entries(query.features).every(
      ([name, value]) => this.features[name as FeatureName] === value
    );
  }

  static fromData(rawSymbol: RawSymbol): BaseSymbol {
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
