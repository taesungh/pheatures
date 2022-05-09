import BaseSymbolList from "./BaseSymbolList";
import FeatureList from "./FeatureList";
import PhonemeInventory from "./PhonemeInventory";

import inventories from "assets/data/phoneme-inventories/";
import rawSymbols from "assets/data/symbol-list.tsv";

const enum DIA {
  FRONTED = "\u031f",
  BACKED = "\u0320",
  PALATALIZED = "ʲ",
  LONG = "\u02d0",
  ASPIRATED = "ʰ",
  EJECTIVE = "\u02bc", // ʼ
  BREATHY_VOICED = "\u0324",
  CREAKY_VOICED = "\u0330",
  BREVE = "\u0361", // for affricates
}

const enum CONS {
  VlBlFr = "ɸ",
  VdVePl = "\u0261", // ɡ
  VdVeNa = "ŋ",
  VdVeFr = "\u0263", // ɣ
  VdVeAp = "ɰ",
  VdUvPl = "ɢ",
  VlUvFr = "χ",
  VdUvFr = "ʁ",
  VlPhFr = "ħ",
  VdPhFr = "ʕ",
  VlGlPl = "\u0294", // ʔ
}

const enum VOW {
  OFU = "a",
  CMFR = "ø",
  ROFU = "æ",
  CBU = "\u026f", // ɯ
  CMBU = "ɤ",
  OBU = "\u0251", // ɑ
  OBR = "ɒ",
}

const SYMBOL_UNKNOWN = "?";

const symbolList = new BaseSymbolList(rawSymbols);

const { EnglishNoDiphthongs, German, HypotheticalLanguage, Korean } = inventories;
const inventoryEnglish = PhonemeInventory.fromData(EnglishNoDiphthongs, symbolList);
const inventoryGerman = PhonemeInventory.fromData(German, symbolList);
const inventoryHypothetical = PhonemeInventory.fromData(HypotheticalLanguage, symbolList);
const inventoryKorean = PhonemeInventory.fromData(Korean, symbolList);

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
  expect(resultCharacters(featureList)).toEqual(["b", "d", "\u0261"]);
  expect(featureList.messages[0].title === "Unnecessary features are selected");
});

test("diacritic in inventory changes features", async () => {
  const featureList = new FeatureList(inventoryGerman, symbolList, "+long", "");
  expect(selectionCharacters(featureList)).toEqual([
    "u" + DIA.LONG,
    "i" + DIA.LONG,
    "y" + DIA.LONG,
    "e" + DIA.LONG,
    "o" + DIA.LONG,
    VOW.OBU + DIA.LONG,
    VOW.CMFR + DIA.LONG,
  ]);
});

test("finds diacritics for opposing feature", async () => {
  const featureList = new FeatureList(inventoryHypothetical, symbolList, "+front, -voice", "+back");
  expect(selectionCharacters(featureList)).toEqual(["k" + DIA.FRONTED, "x" + DIA.FRONTED]);
  expect(resultCharacters(featureList)).toEqual(["k" + DIA.BACKED, "x" + DIA.BACKED]);
  expect(featureList.messages[0].title === "Additional feature changes were added");
});

test("finds diacritic for different base character", async () => {
  const featureList = new FeatureList(
    inventoryHypothetical,
    symbolList,
    "+front, -voice",
    "+voice"
  );
  expect(selectionCharacters(featureList)).toEqual(["k" + DIA.FRONTED, "x" + DIA.FRONTED]);
  expect(resultCharacters(featureList)).toEqual([
    CONS.VdUvPl + DIA.PALATALIZED,
    CONS.VdPhFr + DIA.PALATALIZED,
  ]);
  expect(featureList.messages[0].title === "Unnecessary features are selected");
});

test("reasonable label after multiple changes", async () => {
  const featureList = new FeatureList(
    inventoryHypothetical,
    symbolList,
    "+dorsal, -voice",
    "+back, +voice"
  );
  expect(selectionCharacters(featureList)).toEqual([
    "k" + DIA.FRONTED,
    "k",
    "q",
    "x" + DIA.FRONTED,
    "x",
    CONS.VlUvFr,
    CONS.VlPhFr,
  ]);
  expect(resultCharacters(featureList)).toEqual([
    CONS.VdVePl + DIA.BACKED,
    CONS.VdVePl + DIA.BACKED,
    CONS.VdUvPl,
    CONS.VdVeFr + DIA.BACKED,
    CONS.VdVeFr + DIA.BACKED,
    CONS.VdUvFr,
    CONS.VdPhFr,
  ]);
});

test("changes between diacritics", async () => {
  const featureList = new FeatureList(inventoryKorean, symbolList, "-delayed release", "+voice");
  expect(selectionCharacters(featureList)).toEqual([
    "p",
    "t",
    "k",
    "p" + DIA.ASPIRATED,
    "t" + DIA.ASPIRATED,
    "k" + DIA.ASPIRATED,
    "p" + DIA.EJECTIVE,
    "t" + DIA.EJECTIVE,
    "k" + DIA.EJECTIVE,
  ]);
  expect(resultCharacters(featureList)).toEqual([
    "b",
    "d",
    CONS.VdVePl,
    "b" + DIA.BREATHY_VOICED,
    "d" + DIA.BREATHY_VOICED,
    CONS.VdVePl + DIA.BREATHY_VOICED,
    "b" + DIA.CREAKY_VOICED,
    "d" + DIA.CREAKY_VOICED,
    CONS.VdVePl + DIA.CREAKY_VOICED,
  ]);
});

test("converts to affricates", async () => {
  const featureList = new FeatureList(
    inventoryHypothetical,
    symbolList,
    "-sonorant, -continuant, -coronal",
    "+delayed release"
  );
  expect(selectionCharacters(featureList)).toEqual(["p", "k" + DIA.FRONTED, "k", "q", CONS.VlGlPl]);
  expect(resultCharacters(featureList)).toEqual([
    "p" + DIA.BREVE + CONS.VlBlFr,
    "k" + DIA.FRONTED + DIA.BREVE + "x" + DIA.FRONTED,
    "k" + DIA.BREVE + "x",
    "q" + DIA.BREVE + CONS.VlUvFr,
    SYMBOL_UNKNOWN,
  ]);
});
