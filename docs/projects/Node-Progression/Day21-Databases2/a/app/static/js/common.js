const darkModeToggle = document.querySelector('.menu input');

const DARK_MODE_KEY = 'darkMode';

// Handle dark mode toggle
darkModeToggle.addEventListener('change', e => {
  if(e.target.checked) {
    document.body.classList.add('dark');
    localStorage.setItem(DARK_MODE_KEY, 1);
  }
  else {
    document.body.classList.remove('dark');
    localStorage.setItem(DARK_MODE_KEY, 0);
  }

});

// Restore dark mode setting
if(localStorage.getItem(DARK_MODE_KEY) === "1") {
  darkModeToggle.checked = true;
  document.body.classList.add('dark');
}