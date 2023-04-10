import { useEffect, useState } from "react";

import Papa, { ParseConfig, ParseStepResult } from "papaparse";

function useFileData<T>(file?: string | Papa.LocalFile, options?: ParseConfig): T[] {
	const [data, setData] = useState<T[]>([]);

	useEffect(() => {
		if (file === undefined) {
			return;
		}

		const partial: T[] = [];
		Papa.parse<T>(file, {
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
