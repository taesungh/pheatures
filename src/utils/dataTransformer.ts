import fs from "node:fs";
import path from "node:path";

import Papa from "papaparse";

function parseFile<T>(filePath: string, header?: boolean): T[] {
	const content = fs.readFileSync(path.join(".", filePath), "utf-8");

	const data = Papa.parse<T>(content, {
		delimiter: "\t",
		skipEmptyLines: true,
		header,
	}).data;

	return data;
}

export default parseFile;
