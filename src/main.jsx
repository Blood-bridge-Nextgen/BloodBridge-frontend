import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			{/* <QueryProvider> */}
			<Toaster position="top-right" />
			<App />
			{/* </QueryProvider> */}
		</BrowserRouter>
	</StrictMode>,
);
