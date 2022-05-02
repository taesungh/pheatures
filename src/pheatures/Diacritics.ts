import Diacritic from "./Diacritic";
import FeatureChange from "./FeatureChange";

class Diacritics {
  items: Diacritic[];

  constructor(diacriticsTable: string[][]) {
    this.items = diacriticsTable.map((row) => {
      const [fromQuery, toQuery] = row[2].split(">");
      return new Diacritic(
        row[1].trim(),
        row[0],
        new FeatureChange(fromQuery),
        new FeatureChange(toQuery)
      );
    });
  }
}

export default Diacritics;
