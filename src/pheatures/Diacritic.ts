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
}

export default Diacritic;
