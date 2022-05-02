import Diacritic from "./Diacritic";
import FeatureChange from "./FeatureChange";

class Diacritics {
  items: {
    [index: string]: Diacritic;
  };

  constructor(diacriticsTable: string[][]) {
    this.items = Object.fromEntries(
      diacriticsTable.map(([description, label, query]) => {
        label = label.trim();
        if (label.match(/\d+/)) {
          // numerical labels are converted to their unicode character
          label = String.fromCharCode(Number(label));
        }

        // row contains a feature change such as " +back > -front"
        const [fromQuery, toQuery] = query.split(">");

        const diacritic = new Diacritic(
          label,
          description,
          new FeatureChange(fromQuery),
          new FeatureChange(toQuery)
        );
        return [diacritic.label, diacritic];
      })
    );
  }
}

export default Diacritics;
