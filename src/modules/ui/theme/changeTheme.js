import { toggleThemeButton, toggleThemeButtonIcon } from "./_cache";
import { userPreferredThemeLocalStorageItem } from "./_cache";

const getContrastingTheme = () => {
  const isThemeDark = (document.documentElement.className === 'dark');

  return (isThemeDark ? 'light' : 'dark');
}

// Functions to update related components on theme change.

// (1) Update browser chrome color
const update_themeColorMetadata = () => {
  let themeColorMetadata = document.querySelector('meta[name="theme-color"]');

  if (!themeColorMetadata) {
    themeColorMetadata = document.createElement('meta');
    themeColorMetadata.setAttribute('name', 'theme-color');

    document.head.appendChild(themeColorMetadata);
  }

  // Make color of the browser chrome match the color of the page body (in supporting browsers). Works best if the chrome is at the top.
  themeColorMetadata.setAttribute('content', window.getComputedStyle(document.documentElement).getPropertyValue('--background-color'));

  // Note: Getting the color from a CSS variable is preferred to getting it from the computed styles of the document or one of its elements, as transitions and animations delay the change in the the latter value.
}

// (2) Update theme toggle button
const update_toggleThemeButton = () => {
  const newContrastingTheme = getContrastingTheme();

  toggleThemeButton.setAttribute('aria-label', `Switch to ${newContrastingTheme} theme`);
  toggleThemeButtonIcon.setAttribute('href', `#${newContrastingTheme}-theme-icon`);
}

const updateThemeRelatedElements = () => {
  update_themeColorMetadata();
  update_toggleThemeButton();
}

const changeTheme = (newTheme, changePreferredTheme = false) => {
  document.documentElement.className = newTheme;

  updateThemeRelatedElements();

  // (3) Update user preferred theme
  if (changePreferredTheme)
    localStorage.setItem(userPreferredThemeLocalStorageItem, newTheme);
}

const toggleTheme = (changePreferredTheme = false) => changeTheme(getContrastingTheme(), changePreferredTheme);

export { updateThemeRelatedElements, changeTheme, toggleTheme };
