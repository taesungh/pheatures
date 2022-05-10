export const featureNames = [
  "syllabic",
  "stress",
  "long",
  "consonantal",
  "sonorant",
  "continuant",
  "delayed release",
  "approximant",
  "tap",
  "trill",
  "nasal",
  "voice",
  "spread gl",
  "constr gl",
  "labial",
  "round",
  "labiodental",
  "coronal",
  "anterior",
  "distributed",
  "strident",
  "lateral",
  "dorsal",
  "high",
  "low",
  "front",
  "back",
  "tense",
] as const;

export type FeatureName = typeof featureNames[number];

export enum FeatureValue {
  plus = "+",
  minus = "-",
  nul = "0",
  // alpha = "a",
  // nonAlpha = "A",
  // beta = "b",
  // nonBeta = "B",
}

export const FeatureDisplayValues = {
  [FeatureValue.plus]: "+",
  [FeatureValue.minus]: "\u2212",
  [FeatureValue.nul]: " ",
};

export const FeatureDisplayExplicit = {
  [FeatureValue.plus]: "+",
  [FeatureValue.minus]: "\u2212",
  [FeatureValue.nul]: "0",
};

// variables
// nonVariables
// displayVariables

type FeatureSpecification = Record<FeatureName, FeatureValue>;

export default FeatureSpecification;
