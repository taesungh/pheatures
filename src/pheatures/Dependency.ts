import FeatureChange from "./FeatureChange";

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
      return new Dependency(FeatureChange.fromQuery(fromQuery), FeatureChange.fromQuery(toQuery));
    });
  }
}

export default Dependency;
