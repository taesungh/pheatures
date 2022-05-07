import { useMemo } from "react";

import Dependency from "pheatures/Dependency";
import useFileData from "utils/useFileData";

import dependenciesRules from "assets/data/rules/dependencies.rules";

function useDependencies(): Dependency[] {
  const dependenciesData = useFileData<string[]>(dependenciesRules, {
    delimiter: ">",
    header: false,
  });
  return useMemo(() => Dependency.fromData(dependenciesData), [dependenciesData]);
}

export default useDependencies;
