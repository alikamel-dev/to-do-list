import { pageHeader, toggleThemeButton, toggleThemeButtonIcon } from "./_cache";
import { userPreferredThemeLocalStorageItem } from "./_cache";

const getContrastingTheme = () => {
  const isThemeDark = (document.documentElement.className === 'dark');

  return (isThemeDark ? 'light' : 'dark');
}

const changeTheme = (newTheme, changePreferredTheme = false) => {
  document.documentElement.className = newTheme;

  const newContrastingTheme = getContrastingTheme();

  let themeColorMetadata = document.querySelector('meta[name="theme-color"]');

  if (!themeColorMetadata) {
    themeColorMetadata = document.createElement('meta');
    themeColorMetadata.setAttribute('name', 'theme-color');
    document.head.appendChild(themeColorMetadata);
  }

  // Make color of the browser chrome match the color of the page header in supporting browsers. Works best if the chrome is at the top.
  themeColorMetadata.setAttribute('content', window.getComputedStyle(pageHeader).backgroundColor);

  toggleThemeButton.setAttribute('aria-label', `Switch to ${newContrastingTheme} theme`);
  toggleThemeButtonIcon.setAttribute('href', `#${newContrastingTheme}-theme-icon`);

  if (changePreferredTheme)
    localStorage.setItem(userPreferredThemeLocalStorageItem, newTheme);
}

const toggleTheme = changeTheme.bind(null, getContrastingTheme());

export { changeTheme, toggleTheme };
