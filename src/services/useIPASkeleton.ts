import { useEffect, useMemo, useState } from "react";

import useFileData from "utils/useFileData";

import BaseSymbolList from "pheatures/BaseSymbolList";
import ComplexSymbol from "pheatures/ComplexSymbol";
import IPASkeleton from "pheatures/IPASkeleton";

interface IPASkeletonHandler {
	skeleton: IPASkeleton;
	selected: ComplexSymbol[];
	handleSelect: (symbol: ComplexSymbol) => void;
	loading: boolean;
	collapse: () => ComplexSymbol[];
}

function useIPASkeleton(
	skeletonFile: string,
	symbolList: BaseSymbolList,
	symbols: ComplexSymbol[]
): IPASkeletonHandler {
	const rawSkeleton = useFileData<string[]>(skeletonFile);

	const skeleton = useMemo(
		() => new IPASkeleton(rawSkeleton, symbolList),
		[rawSkeleton, symbolList]
	);

	// skeleton is initially empty since file data needs to be loaded
	// update the selection to account for the existing symbol list
	const [selected, setSelected] = useState<ComplexSymbol[]>([]);
	useEffect(() => {
		setSelected(skeleton.initialize(symbols));
	}, [skeleton, symbols]);

	const handleSelect = (symbol: ComplexSymbol): void => {
		setSelected((selected) => {
			// When selecting a custom diacritic, an equivalent but differing reference could be given
			if (!selected.includes(symbol)) {
				// Use the new reference provided by the skeleton
				symbol = skeleton.verify(symbol);
				if (selected.includes(symbol)) {
					// TODO: alert already included
					alert(`The symbol ${symbol.displayCharacter} is already selected.`);
					return selected;
				}
			}

			const selectedIndex = selected.indexOf(symbol);
			// if not selected, insert at end; otherwise, remove the value
			return selectedIndex === -1
				? selected.concat(symbol)
				: selected.slice(0, selectedIndex).concat(selected.slice(selectedIndex + 1));
		});
	};

	const loading = skeleton.cells.length === 0;

	const collapse = (): ComplexSymbol[] => {
		return skeleton.collapse(selected);
	};

	return { skeleton, selected, handleSelect, loading, collapse };
}

export default useIPASkeleton;
