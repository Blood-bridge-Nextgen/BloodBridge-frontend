import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import { WatchupProvider } from "@watchupltd/react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ReactQuery } from "./Components/ReactQuery.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ReactQuery>
        <Toaster position="top-right" />
        <WatchupProvider apiKey={import.meta.env.VITE_WATCHUP_API_KEY}>
          <App />
        </WatchupProvider>
      </ReactQuery>
    </BrowserRouter>
  </StrictMode>,
);
