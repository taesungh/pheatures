import React, { useEffect, useState } from "react";

import Autocomplete, { AutocompleteChangeReason } from "@mui/material/Autocomplete";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { FeatureName, featureNames, FeatureValue } from "pheatures/FeatureSpecification";

type FeatureQuery = {
	value: FeatureValue;
	name: FeatureName | null;
	uid: number;
};

// maintain unique IDs to use as keys in map
// compared to indexing, this allows reordering, e.g. if earlier row is removed
let uid = 0;
const getUID = () => ++uid;

interface SelectFeaturesProps {
	setQuery: React.Dispatch<React.SetStateAction<string>>;
}

function SelectFeatures({ setQuery }: SelectFeaturesProps) {
	const [featureQueries, setFeatureQueries] = useState<FeatureQuery[]>([]);

	useEffect(() => {
		// turn list of feature queries into query string
		setQuery(
			featureQueries
				.filter(({ name }) => name)
				.map(({ value, name }) => `${value}${name}`)
				.join(",")
		);
	}, [featureQueries, setQuery]);

	return (
		<Stack spacing={2}>
			{featureQueries.map(({ name, value, uid }, i) => (
				<SelectFeature
					key={uid}
					index={i}
					value={value}
					name={name}
					featureQueries={featureQueries}
					setFeatureQueries={setFeatureQueries}
				/>
			))}
			{(featureQueries.length === 0 ||
				featureQueries[featureQueries.length - 1].name !== null) && (
				<SelectFeature
					index={featureQueries.length}
					value={""}
					name={null}
					featureQueries={featureQueries}
					setFeatureQueries={setFeatureQueries}
				/>
			)}
		</Stack>
	);
}

interface SelectFeatureProps {
	index: number;
	value: FeatureValue | "";
	name: FeatureName | null;
	featureQueries: FeatureQuery[];
	setFeatureQueries: React.Dispatch<React.SetStateAction<FeatureQuery[]>>;
}

// one row of the selection interface
function SelectFeature({
	index,
	value,
	name,
	featureQueries,
	setFeatureQueries,
}: SelectFeatureProps) {
	const handleSelectValue = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFeatureQueries((featureQueries) => {
			if (index === featureQueries.length) {
				return featureQueries.concat([
					{ value: event.target.value as FeatureValue, name: null, uid: getUID() },
				]);
			}
			// otherwise, remove from list
			featureQueries = featureQueries.slice();
			featureQueries[index].value = event.target.value as FeatureValue;
			return featureQueries;
		});
	};

	const handleSelectName = (
		event: React.SyntheticEvent,
		newValue: FeatureName | null,
		reason: AutocompleteChangeReason
	) => {
		// when clicking on the clear button
		if (reason === "clear" && event.type === "click") {
			// remove this row from the queries
			setFeatureQueries((featureQueries) =>
				featureQueries.slice(0, index).concat(featureQueries.slice(index + 1))
			);
			return;
		}
		// set the value at the index
		setFeatureQueries((featureQueries) => {
			featureQueries = featureQueries.slice();
			featureQueries[index].name = newValue;
			return featureQueries;
		});
	};

	return (
		<Stack direction="row">
			<TextField
				select
				id={`feature-value-select-${index}`}
				value={value}
				onChange={handleSelectValue}
				sx={{ width: "5rem" }}
				label="value"
			>
				{[FeatureValue.plus, FeatureValue.minus, FeatureValue.nul].map((featureValue) => (
					<MenuItem key={featureValue} value={featureValue}>
						{featureValue}
					</MenuItem>
				))}
			</TextField>
			{value !== "" && (
				<Autocomplete
					value={name}
					id={`feature-label-select-${index}`}
					onChange={handleSelectName}
					options={featureNames}
					getOptionDisabled={(option) =>
						featureQueries.map(({ name }) => name).includes(option)
					}
					renderInput={(params) => <TextField {...params} label="Feature" />}
					sx={{ width: "15rem" }}
				/>
			)}
		</Stack>
	);
}

export default SelectFeatures;
