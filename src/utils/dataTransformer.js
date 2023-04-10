// import parseData from "./parseData";
const Papa = require("papaparse");

/** @type {import('@jest/transform/build/types').SyncTransformer} */
module.exports = {
	process(sourceText, sourcePath) {
		const data = Papa.parse(sourceText, {
			delimiter: "\t",
			skipEmptyLines: true,
			header: sourcePath.endsWith(".tsv"),
		}).data;
		return { code: `module.exports = ${JSON.stringify(data)}` };
	},
};
