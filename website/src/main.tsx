import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import theme from "./Theme"
import { MantineProvider } from "@mantine/core"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
			<App />
		</MantineProvider>
	</React.StrictMode>
)
