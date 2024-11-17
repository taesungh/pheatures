import FeatureChange from "./FeatureChange";

import contradictionsData from "@/assets/data/rules/contradictions.json";

class Contradictions {
	// holds feature changes which could not exist
	items: FeatureChange[];

	constructor(items: FeatureChange[]) {
		this.items = items;
	}

	static fromData(contradictionsData: string[]): Contradictions {
		return new Contradictions(contradictionsData.map(FeatureChange.fromQuery));
	}
}

export const contradictions = Contradictions.fromData(contradictionsData);

export default Contradictions;
