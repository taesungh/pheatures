import FeatureChange from "./FeatureChange";

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

export default Contradictions;
