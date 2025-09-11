const darkModeToggle = document.querySelector('.menu input');

// Storage
const SELECT_DARK_KEY = "darkKey";

// Handle dark mode toggle
darkModeToggle.addEventListener('change', e => {

  if(e.target.checked) {
    document.body.classList.add('dark');
    localStorage.setItem(SELECT_DARK_KEY, 1);
  }
  else {
    document.body.classList.remove('dark');
    localStorage.setItem(SELECT_DARK_KEY, 0);
  }

});

// Storage
if(localStorage.getItem(SELECT_DARK_KEY) === '1') {
  darkModeToggle.checked = true;
  document.body.classList.add('dark')
}