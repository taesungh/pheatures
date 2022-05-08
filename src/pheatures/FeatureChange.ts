import ComplexSymbol from "./ComplexSymbol";
import Dependency from "./Dependency";
import FeatureSpecification, { FeatureName, FeatureValue } from "./FeatureSpecification";

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
  // Returns the dependencies that are applied
  applyDependencies(dependencies: Dependency[]): Dependency[] {
    // TODO: handle variables

    const applied = dependencies
      // select dependencies where the source matches the current features
      // multiple conflicting dependencies may match, but contradictions should produce a warning
      .filter((dependency) => this.matches(dependency.from))
      // apply the dependency result to this feature change
      .map((dependency) => {
        this.applyChanges(dependency.to);
        return dependency;
      });
    return applied;
  }

  // returns a copy of this FeatureChange without the specified feature
  removeFeature(featureName: FeatureName): FeatureChange {
    return new FeatureChange(
      Object.fromEntries(
        Object.entries(this.features).filter(([name, value]) => name !== featureName)
      )
    );
  }

  // returns a FeatureChange with the features that would not change on the given array of symbols
  findVacuous(symbols: ComplexSymbol[]): FeatureChange {
    return new FeatureChange(
      Object.fromEntries(
        Object.entries(this.features).filter(([name, value]) =>
          // if every symbol already has this feature value
          symbols.every((symbol) => symbol.features[name as FeatureName] === value)
        )
      )
    );
  }

  // express feature change in bracket notation
  toString(): string {
    return `[${Object.entries(this.features)
      .map(([name, value]) => `${value}${name}`)
      .join(", ")}]`;
  }
}

export default FeatureChange;
