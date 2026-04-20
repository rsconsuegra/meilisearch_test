import "./styles/theme.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import EnvError from "./components/EnvError/EnvError";
import { validateEnv } from "./config/env";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

try {
  validateEnv();
} catch (err) {
  const message = err instanceof Error ? err.message : "Unknown configuration error.";
  createRoot(root).render(<EnvError message={message} />);
  throw err;
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
