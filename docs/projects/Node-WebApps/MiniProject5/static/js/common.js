// Dark mode functionality
const darkModeToggle = document.querySelector('.dark-mode-toggle');

const DARK_MODE_KEY = 'darkMode';

if (darkModeToggle) {
    darkModeToggle.addEventListener('change', e => {
        if (e.target.checked) {
            document.body.classList.add('dark');
            localStorage.setItem(DARK_MODE_KEY, '1');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem(DARK_MODE_KEY, '0');
        }
    });

    // Restore dark mode setting
    if (localStorage.getItem(DARK_MODE_KEY) === '1') {
        darkModeToggle.checked = true;
        document.body.classList.add('dark');
    }
}

// Utility functions
function showError(message) {
    const errorEl = document.getElementById('error');
    if (errorEl) {
        errorEl.textContent = message;
    }
}

function clearError() {
    const errorEl = document.getElementById('error');
    if (errorEl) {
        errorEl.textContent = '';
    }
}