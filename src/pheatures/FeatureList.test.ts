import BaseSymbolList from "./BaseSymbolList";
import FeatureList from "./FeatureList";
import PhonemeInventory from "./PhonemeInventory";

import EnglishNoDiphthongs from "assets/data/phoneme-inventories/EnglishNoDiphthongs.inv";
import rawSymbols from "assets/data/symbol-list.tsv";

const symbolList = new BaseSymbolList(rawSymbols);
const inventoryEnglish = PhonemeInventory.fromData(EnglishNoDiphthongs, symbolList);

const selectionCharacters = (featureList: FeatureList): string[] =>
  featureList.items.map((symbol) => symbol.antecedent.displayCharacter);

const resultCharacters = (featureList: FeatureList): string[] =>
  featureList.items.map((symbol) => symbol.displayCharacter);

test("can run basic selection and transform", async () => {
  const featureList = new FeatureList(inventoryEnglish, symbolList, "-delayed release", "+voice");
  expect(selectionCharacters(featureList)).toEqual(["p", "t", "k", "b", "d", "\u0261"]);
  expect(resultCharacters(featureList)).toEqual(["b", "d", "\u0261", "b", "d", "\u0261"]);
});

test("warns about unnecessary selection", async () => {
  const featureList = new FeatureList(
    inventoryEnglish,
    symbolList,
    "-delayed release, -voice",
    "+voice"
  );
  expect(selectionCharacters(featureList)).toEqual(["p", "t", "k"]);
  expect(featureList.messages[0].title === "Unnecessary features are selected");
});
