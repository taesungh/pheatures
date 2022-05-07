import BaseSymbol from "./BaseSymbol";
import Diacritic from "./Diacritic";
import FeatureChange from "./FeatureChange";

// Maintains an array of Diacritic objects in a specific order
// This order is used when determining the order to display them
class Diacritics {
  // The postalveolar diacritic and backed velar diacritic both use \u0320 (#800),
  // so an Array is used instead of a Map
  items: Diacritic[];

  constructor(diacriticsTable: string[][]) {
    this.items = diacriticsTable.map(([description, label, query]) => {
      label = label.trim();
      if (label.match(/\d+/)) {
        // numerical labels are converted to their unicode character
        label = String.fromCharCode(Number(label));
      }

      // row contains a feature change such as " +back > -front"
      const [fromQuery, toQuery] = query.split(">");

      return new Diacritic(
        label,
        description,
        FeatureChange.fromQuery(fromQuery),
        FeatureChange.fromQuery(toQuery)
      );
    });
  }

  getFromLabel(baseSymbol: BaseSymbol, label: string): Diacritic {
    const options = this.items.filter((diacritic) => diacritic.label === label);
    if (options.length === 1) {
      return options[0];
    }
    const checkedOptions = options.filter((diacritic) => baseSymbol.matches(diacritic.from));
    if (checkedOptions.length === 1) {
      return checkedOptions[0];
    }
    throw new Error("could not find a matching diacritic from the given label");
  }
}

export default Diacritics;
