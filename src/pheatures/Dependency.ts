import FeatureChange from "./FeatureChange";

import dependenciesData from "@/assets/data/rules/dependencies.json";

// represents a dependency: a certain feature change may imply another change
// e.g. +high implies -low
class Dependency {
	from: FeatureChange;
	to: FeatureChange;

	constructor(from: FeatureChange, to: FeatureChange) {
		this.from = from;
		this.to = to;
	}

	static fromData(dependenciesData: string[][]): Dependency[] {
		return dependenciesData.map((row) => {
			const [fromQuery, toQuery] = row;
			return new Dependency(
				FeatureChange.fromQuery(fromQuery),
				FeatureChange.fromQuery(toQuery)
			);
		});
	}
}

export const dependencies = Dependency.fromData(dependenciesData);

export default Dependency;
