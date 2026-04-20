/**
 * Theme toggle — Connascence of Algorithm (CoA) with index.html.
 *
 * The theme resolution logic here (getInitialTheme) is duplicated as an inline
 * script in index.html to prevent FOUC. Any changes to the resolution algorithm
 * (localStorage key, media query, or default) must be applied in BOTH places.
 *
 * The inline script in index.html runs synchronously before React hydrates,
 * setting `data-theme` on <html>. This component then takes over for runtime
 * toggling and persists the choice via localStorage.
 */

import { useEffect, useState } from "react";

import styles from "./ThemeToggle.module.css";

type Theme = "dark" | "light";

const STORAGE_KEY = "searcher-theme";

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  if (typeof window.matchMedia === "function") {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  return "dark";
}

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
}

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggle = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  };

  return (
    <button
      className={styles.button}
      onClick={toggle}
      type="button"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <span className={styles.icon} data-theme-icon={theme} />
    </button>
  );
}

export default ThemeToggle;
