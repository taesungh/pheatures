import { useEffect, useState } from "react";

import Papa, { ParseConfig, ParseStepResult } from "papaparse";

function useFileData<T>(file: string, options?: ParseConfig): T[] {
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    const partial: T[] = [];
    Papa.parse(file, {
      download: true,
      header: options?.header,
      step: (results: ParseStepResult<T>) => {
        partial.push(results.data);
      },
      complete: () => {
        setData(partial);
      },
      skipEmptyLines: true,
      delimiter: options?.delimiter,
    });
  }, [file, options?.header, options?.delimiter]);

  return data;
}

export default useFileData;
