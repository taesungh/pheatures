import { useMemo } from "react";

import ComplexSymbol from "pheatures/ComplexSymbol";
import PhonemeInventory from "pheatures/PhonemeInventory";

function usePhonemeInventory(symbols: ComplexSymbol[]) {
  return useMemo(() => new PhonemeInventory(symbols), [symbols]);
}

export default usePhonemeInventory;
