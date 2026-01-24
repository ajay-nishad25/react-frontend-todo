const THEME_KEY = "selectedTheme";

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || "light";
}

export function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
}

export function initTheme() {
  document.documentElement.setAttribute("data-theme", getTheme());
}
