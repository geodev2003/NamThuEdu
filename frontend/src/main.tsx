import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import "./i18n"; // Import i18n config
import { ThemeProvider } from "./contexts/ThemeContext";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
  
