const pageHeader = document.querySelector('#page-header');

const toggleThemeButton = document.querySelector('#theme-toggle');
const toggleThemeButtonIcon = toggleThemeButton.querySelector('use');

const userPreferredThemeLocalStorageItem = 'userPreferredTheme';

export {
  pageHeader,

  toggleThemeButton,
  toggleThemeButtonIcon,

  userPreferredThemeLocalStorageItem,
};
