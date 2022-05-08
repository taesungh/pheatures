import { ThemeProvider } from "@mui/material/styles";

import theme from "utils/theme";

import { Home } from "./pages";

import "./App.css";

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <header className="App-header">Pheatures Spreadsheet Online</header>
        <Home />
      </ThemeProvider>
    </div>
  );
}

export default App;
