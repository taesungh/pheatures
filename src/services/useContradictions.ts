import { useMemo } from "react";

import Contradictions from "pheatures/Contradictions";
import useFileData from "utils/useFileData";

import contradictionsRules from "assets/data/rules/contradictions.rules";

function useContradictions(): Contradictions {
  const rawData = useFileData<string[]>(contradictionsRules, {
    // do not split lines by comma
    delimiter: ".",
    header: false,
  });
  const contradictionsData = rawData.map((entry) => entry[0]);
  return useMemo(() => Contradictions.fromData(contradictionsData), [contradictionsData]);
}

export default useContradictions;
