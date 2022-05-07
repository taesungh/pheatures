import Dependency from "./Dependency";
import FeatureSpecification, { FeatureName, FeatureValue } from "./FeatureSpecification";
import Message from "./Message";

// Represents a feature matrix
// based on Symbol.java

type PartialFeatureSpecification = Partial<FeatureSpecification>;

class FeatureChange {
  features: PartialFeatureSpecification;

  constructor(features: PartialFeatureSpecification) {
    this.features = features;
  }

  // query is a line such as "+low,-back"
  static fromQuery(query: string): FeatureChange {
    if (query.length === 0) {
      return new FeatureChange({});
    }
    const features = Object.fromEntries(
      query.split(",").map((change) => {
        // remove extra whitespace
        change = change.trim();
        // the change character precedes the name
        const value = change.charAt(0);
        const name = change.substring(1);
        return [name as FeatureName, value as FeatureValue];
      })
    );
    return new FeatureChange(features);
  }

  isNull() {
    return Object.entries(this.features).length === 0;
  }

  matches(change: FeatureChange): boolean {
    return Object.entries(change.features).every(
      ([name, value]) => this.features[name as FeatureName] === value
    );
  }

  applyChanges(change: FeatureChange): void {
    Object.entries(change.features).forEach(([name, value]) => {
      this.features[name as FeatureName] = value;
    });
  }

  // Take a set of dependencies and apply them to this feature change
  // Returns a list of messages describing any dependencies that are applied
  applyDependencies(dependencies: Dependency[]): Message[] {
    // TODO: handle variables

    const messages = dependencies
      // select dependencies where the source matches the current features
      // multiple conflicting dependencies may match, but contradictions should produce a warning
      .filter((dependency) => this.matches(dependency.from))
      // apply the dependency result to this feature change
      .map((dependency) => {
        this.applyChanges(dependency.to);
        return Message.dependency();
      });
    return messages;
  }

  // returns a copy of this FeatureChange without the specified feature
  removeFeature(featureName: FeatureName): FeatureChange {
    return new FeatureChange(
      Object.fromEntries(
        Object.entries(this.features).filter(([name, value]) => name !== featureName)
      )
    );
  }
}

export default FeatureChange;
