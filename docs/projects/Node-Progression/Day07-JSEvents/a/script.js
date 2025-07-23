const darkModeToggle = document.querySelector("#darkModeToggle");

darkModeToggle.addEventListener('change', e => {
    // CSS class solution
    if (darkModeToggle.checked) {
        document.querySelector('html').classList.add('invert')
    }
    else {
        document.querySelector('html').classList.remove('invert')
    }

    // Incomplete CSS filter solution
    // document.querySelector('html').style.filter = 'invert(1)';
})