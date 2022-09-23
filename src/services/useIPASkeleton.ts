import { useMemo } from "react";

import useFileData from "utils/useFileData";

import BaseSymbolList from "pheatures/BaseSymbolList";
import IPASkeleton from "pheatures/IPASkeleton";

function useIPASkeleton(skeletonFile: string, symbolList: BaseSymbolList): IPASkeleton {
  const rawSkeleton = useFileData<string[]>(skeletonFile);
  return useMemo(() => new IPASkeleton(rawSkeleton, symbolList), [rawSkeleton, symbolList]);
}

export default useIPASkeleton;
