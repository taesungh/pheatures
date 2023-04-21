import { useState } from "react";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import Diacritic from "pheatures/Diacritic";
import { diacriticList } from "pheatures/Diacritics";

const DOTTED_CIRCLE = "\u25cc";

interface DiacriticSelectorProps {
	diacritic: Diacritic | null;
	setDiacritic: React.Dispatch<React.SetStateAction<Diacritic | null>>;
}

function DiacriticSelector({ diacritic, setDiacritic }: DiacriticSelectorProps) {
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const open = Boolean(anchorEl);

	const openDiacriticList = (event: React.MouseEvent<HTMLElement>): void => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const selectDiacritic = (d: Diacritic): void => {
		setDiacritic(d);
		handleClose();
	};

	return (
		<>
			<Button onClick={openDiacriticList}>
				<Tooltip title="Add custom diacritic">
					<Typography variant="phoneme">
						{DOTTED_CIRCLE + (diacritic?.label || "")}
					</Typography>
				</Tooltip>
			</Button>
			<Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
				{diacriticList.items.map((d) => (
					<MenuItem
						key={d.description}
						selected={d === diacritic}
						onClick={() => selectDiacritic(d)}
					>
						<Tooltip title={d.description}>
							<Typography variant="phoneme">{DOTTED_CIRCLE + d.label}</Typography>
						</Tooltip>
					</MenuItem>
				))}
			</Menu>
		</>
	);
}

export default DiacriticSelector;
