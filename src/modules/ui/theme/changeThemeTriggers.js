import { toggleThemeButton, userPreferredThemeLocalStorageItem } from "./_cache";
import { changeTheme, toggleTheme } from "./changeTheme";

toggleThemeButton.addEventListener('click', () => toggleTheme(true));

const isPreferredColorSchemeDarkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

const changeThemeBasedOnPreferredColorScheme = (event = isPreferredColorSchemeDarkMediaQuery) => {
  if (localStorage.getItem(userPreferredThemeLocalStorageItem))
    return;

  const newTheme = event.matches ? 'dark' : 'light';

  changeTheme(newTheme);
}

document.addEventListener('DOMContentLoaded', () => changeThemeBasedOnPreferredColorScheme());
isPreferredColorSchemeDarkMediaQuery.addEventListener('change', changeThemeBasedOnPreferredColorScheme);
