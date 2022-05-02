import { FeatureName, FeatureValue } from "./FeatureSpecification";

// Represents a feature matrix
// based on Symbol.java

type PartialFeatureSpecification = Partial<Record<FeatureName, FeatureValue>>;

class FeatureChange {
  features: PartialFeatureSpecification;

  // query is a line such as "+low,-back"
  constructor(query: string) {
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
}

export default FeatureChange;
