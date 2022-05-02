import Container from "@mui/material/Container";

import { Spreadsheet } from "components";

import useDiacritics from "services/useDiacritics";
import usePhonemeInventory from "services/usePhonemeInventory";
import useSymbolList from "services/useSymbolList";

import EnglishNoDiphthongs from "assets/data/phoneme-inventories/EnglishNoDiphthongs.inv";

function Home() {
  const symbolList = useSymbolList();
  const diacritics = useDiacritics();
  const inventory = usePhonemeInventory(EnglishNoDiphthongs, symbolList, diacritics);

  return (
    <Container maxWidth="xl">
      <Spreadsheet phonemeInventory={inventory} />
    </Container>
  );
}

export default Home;
