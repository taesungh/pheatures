import React, { useEffect, useState } from "react";

import Autocomplete, { AutocompleteChangeReason } from "@mui/material/Autocomplete";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { FeatureName, featureNames, FeatureValue } from "pheatures/FeatureSpecification";

interface SelectFeatureProps {
  index: number;
  value: FeatureValue | "";
  name?: FeatureName | null;
}

type FeatureQuery = {
  value: FeatureValue;
  name?: FeatureName | null;
};

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

  function SelectFeature({ index, value, name }: SelectFeatureProps) {
    const handleSelectValue = (event: React.ChangeEvent<HTMLInputElement>) => {
      setFeatureQueries((featureQueries) => {
        if (index === featureQueries.length) {
          return featureQueries.concat([{ value: event.target.value as FeatureValue }]);
        }
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
      <Stack direction="row" sx={{ padding: 1 }}>
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
            onChange={handleSelectName}
            options={featureNames}
            getOptionDisabled={(option) => featureQueries.map(({ name }) => name).includes(option)}
            renderInput={(params) => <TextField {...params} label="Feature" />}
            sx={{ width: "15rem" }}
          />
        )}
      </Stack>
    );
  }

  return (
    <Stack>
      {featureQueries.map(({ name, value }, i) => (
        <SelectFeature key={name || " "} index={i} value={value} name={name} />
      ))}
      {(featureQueries.length === 0 ||
        featureQueries[featureQueries.length - 1].name !== undefined) && (
        <SelectFeature index={featureQueries.length} value={""} />
      )}
    </Stack>
  );
}

export default SelectFeatures;
