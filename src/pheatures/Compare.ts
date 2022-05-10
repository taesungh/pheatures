import ComplexSymbol from "./ComplexSymbol";
import { FeatureName, featureNames } from "./FeatureSpecification";

function commonFeatures(symbols: ComplexSymbol[]): FeatureName[] {
  if (symbols.length === 0) {
    return [];
  }
  const [start, ...rest] = symbols;
  return featureNames.filter((name) => {
    const val = start.features[name];
    return rest.every((symbol) => symbol.features[name] === val);
  });
}

function differentFeatures(symbols: ComplexSymbol[]): FeatureName[] {
  if (symbols.length === 0) {
    return [];
  }
  const [start, ...rest] = symbols;
  return featureNames.filter((name) => {
    const val = start.features[name];
    return rest.some((symbol) => symbol.features[name] !== val);
  });
}

export { commonFeatures, differentFeatures };
