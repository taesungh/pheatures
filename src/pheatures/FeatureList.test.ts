import { expect, test } from "vitest";

import { CONS, DIA, VOW } from "@/utils/phonemes";

import FeatureList from "./FeatureList";
import inventories from "./PhonemeInventory.test.ts";
import symbolList from "./SymbolList.test";

const inventoryEnglish = inventories.EnglishNoDiphthongs;
const inventoryGerman = inventories.German;
const inventoryHypothetical = inventories.HypotheticalLanguage;
const inventoryKorean = inventories.Korean;

const SYMBOL_UNKNOWN = "?";

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

test("finds affricate with double diacritics", async () => {
	const featureList = new FeatureList(
		inventoryHypothetical,
		symbolList,
		"+dorsal, -continuant, -sonorant",
		"+delayed release, +back"
	);
	expect(selectionCharacters(featureList)).toEqual(["k" + DIA.FRONTED, "k", "q"]);
	expect(resultCharacters(featureList)).toEqual([
		"k" + DIA.BACKED + DIA.BREVE + "x" + DIA.BACKED,
		"k" + DIA.BACKED + DIA.BREVE + "x" + DIA.BACKED,
		"q" + DIA.BREVE + CONS.VlUvFr,
	]);
});

test("reasonable multiple diacritics", async () => {
	const featureList = new FeatureList(inventoryKorean, symbolList, "+dorsal, -sonorant", "+front");
	expect(selectionCharacters(featureList)).toEqual(["k", "k" + DIA.ASPIRATED, "k" + DIA.EJECTIVE]);
	expect(resultCharacters(featureList)).toEqual([
		"k" + DIA.FRONTED,
		"k" + DIA.FRONTED + DIA.ASPIRATED,
		// differs from original behavior in favor of simpler diacritic
		"k" + DIA.FRONTED + DIA.EJECTIVE,
	]);
});

test("changes between diacritics", async () => {
	const featureList = new FeatureList(
		inventoryKorean,
		symbolList,
		"+dorsal, -sonorant",
		"+front, +voice"
	);
	expect(selectionCharacters(featureList)).toEqual(["k", "k" + DIA.ASPIRATED, "k" + DIA.EJECTIVE]);
	// matches original behavior, although questionable
	expect(resultCharacters(featureList)).toEqual([
		// could be simply change "k" to VdVlPl and add DIA.FRONTED
		CONS.VdUvPl + DIA.PALATALIZED,
		CONS.VdUvPl + DIA.BREATHY_VOICED + DIA.PALATALIZED,
		CONS.VdUvPl + DIA.CREAKY_VOICED + DIA.PALATALIZED,
	]);
});
