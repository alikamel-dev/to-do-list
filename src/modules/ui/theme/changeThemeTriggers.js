import { toggleThemeButton, userPreferredThemeLocalStorageItem } from "./_cache";
import { changeTheme, toggleTheme, updateThemeRelatedElements } from "./changeTheme";

// (1) Change theme color on pressing the theme toggle button, and make it the user preferred theme.
toggleThemeButton.addEventListener('click', () => toggleTheme(true));

const prefersDarkColorSchemeMediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');

const changeThemeBasedOnPreferredColorScheme = (prefersDarkColorSchemeEvent = prefersDarkColorSchemeMediaQueryList) => {
  const newTheme = prefersDarkColorSchemeEvent.matches ? 'dark' : 'light';

  changeTheme(newTheme);
}

// (2) Change theme color to match the the value of the `prefers-color-scheme` media query, unless a user preferred theme is defined.
if (!localStorage.getItem(userPreferredThemeLocalStorageItem)) {
  // (2 - 1) Do (2) on page load
  changeThemeBasedOnPreferredColorScheme();

  // (2 - 2) Do (2) on change in the value of the `prefers-color-scheme` media query
  prefersDarkColorSchemeMediaQueryList.addEventListener('change', changeThemeBasedOnPreferredColorScheme);
}

// Updates the theme-related elements on page load, since the script applying the user preferred theme is in the HTML and does not call the `changeTheme` function (which calls the `updateThemeRelatedElements` function).
updateThemeRelatedElements();
