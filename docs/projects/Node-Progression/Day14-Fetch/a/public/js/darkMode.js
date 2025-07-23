
const darkModeToggle = document.querySelector('#darkModeToggle');

darkModeToggle.addEventListener('change', e => {
  // Solution via CSS class
  if (darkModeToggle.checked) {
    document.querySelector('html').classList.add('invert');
  } else {
    document.querySelector('html').classList.remove('invert');
  }

  // Solution via CSS filter
  //document.querySelector('html').style.filter = `invert(${darkModeToggle.checked ? 1 : 0})`;
});

