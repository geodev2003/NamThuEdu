import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import "./i18n"; // Import i18n config
import { ThemeProvider, useThemeContext } from "./contexts/ThemeContext";
import { ThemeLoader } from "./components/theme/ThemeLoader";

function AppWithTheme() {
  const { isLoading } = useThemeContext();

  if (isLoading) {
    return <ThemeLoader />;
  }

  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <AppWithTheme />
  </ThemeProvider>
);
  