import ComplexSymbol from "./ComplexSymbol";
import FeatureChange from "./FeatureChange";

export const diacriticDescriptions = [
	"syllabic",
	"creaky-voiced",
	"voiceless;",
	"breathy-voiced",
	"postalveolar",
	"dental",
	"fronted velar",
	"backed velar",
	"stressed",
	"long",
	"aspirated",
	"palatalized",
	"labialized",
	"velarized",
	"pharyngealized",
	"nasalized",
	"rhotic",
	"ejective",
] as const;

export type DiacriticDescription = (typeof diacriticDescriptions)[number];

// A single diacritic symbol
class Diacritic {
	label: string;
	description: DiacriticDescription;

	// the requirements of the base symbol this diacritic can attach to
	from: FeatureChange;
	// the feature changes this diacritic makes to the base symbol
	to: FeatureChange;

	constructor(
		label: string,
		description: string,
		from: FeatureChange,
		to: FeatureChange
	) {
		this.label = label;
		this.description = description as DiacriticDescription;
		this.from = from;
		this.to = to;
	}

	// Whether or not this diacritic can be applied to the given symbol
	canApplyTo(symbol: ComplexSymbol): boolean {
		return symbol.matches(this.from) && !symbol.diacritics.includes(this);
	}

	// Indicates why this diacritic cannot be applied to the symbol
	incompatibility(symbol: ComplexSymbol): FeatureChange {
		return this.from.difference(symbol.features);
	}
}

export default Diacritic;
