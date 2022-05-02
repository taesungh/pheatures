import BaseSymbolList from "pheatures/BaseSymbolList";
import Diacritics from "pheatures/Diacritics";
import PhonemeInventory from "pheatures/PhonemeInventory";
import useFileData from "utils/useFileData";

function usePhonemeInventory(
  inventoryFile: string,
  baseSymbols: BaseSymbolList,
  diacritics: Diacritics
) {
  const phonemeData = useFileData<string[]>(inventoryFile, { delimiter: "\t" });
  return new PhonemeInventory(phonemeData, baseSymbols, diacritics);
}

export default usePhonemeInventory;
