import { FeatureName, FeatureValue } from "./FeatureSpecification";

// Represents a feature matrix
// based on Symbol.java

type PartialFeatureSpecification = Partial<Record<FeatureName, FeatureValue>>;

class FeatureChange {
  features: PartialFeatureSpecification;

  // query is a line such as "+low,-back"
  constructor(query: string) {
    if (query.length === 0) {
      this.features = {};
      return;
    }
    this.features = Object.fromEntries(
      query.split(",").map((change) => {
        // remove extra whitespace
        change = change.trim();
        // the change character precedes the name
        const value = change.charAt(0);
        const name = change.substring(1);
        return [name as FeatureName, value as FeatureValue];
      })
    );
  }

  isNull() {
    return Object.entries(this.features).length === 0;
  }
}

export default FeatureChange;
