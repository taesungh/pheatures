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
  unknown = "?",
  notFoundLabel = "?",
  plus = "+",
  minus = "-",
  nul = "0",
  alpha = "a",
  nonAlpha = "A",
  beta = "b",
  nonBeta = "B",
  displayMin = "\u2212",
  displayNon = "-",
  displayNul = " ",
}

// variables
// nonVariables
// displayVariables

type FeatureSpecification = Record<FeatureName, FeatureValue>;

export default FeatureSpecification;
