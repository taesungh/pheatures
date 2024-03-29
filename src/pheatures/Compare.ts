import BaseSymbol from "./BaseSymbol";
import { FeatureName, featureNames } from "./FeatureSpecification";

function commonFeatures(symbols: BaseSymbol[]): FeatureName[] {
	if (symbols.length === 0) {
		return [];
	}
	const [start, ...rest] = symbols;
	return featureNames.filter((name) => {
		const val = start.features[name];
		return rest.every((symbol) => symbol.features[name] === val);
	});
}

function differentFeatures(symbols: BaseSymbol[]): FeatureName[] {
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
