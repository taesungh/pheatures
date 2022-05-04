import { useMemo } from "react";

import Diacritics from "pheatures/Diacritics";
import useFileData from "utils/useFileData";

import diacriticsRules from "assets/data/rules/diacritics.rules";

function useDiacritics() {
  const diacriticsData = useFileData<string[]>(diacriticsRules, {
    delimiter: ";",
    header: false,
  });
  return useMemo(() => new Diacritics(diacriticsData), [diacriticsData]);
}

export default useDiacritics;
