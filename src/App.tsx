import { ThemeProvider } from "@mui/material/styles";

import theme from "utils/theme";

import { Footer, Header } from "components";
import { Home } from "pages";

import "./App.css";

function App() {
	return (
		<div className="App">
			<ThemeProvider theme={theme}>
				<Header />
				<Home />
				<Footer />
			</ThemeProvider>
		</div>
	);
}

export default App;
