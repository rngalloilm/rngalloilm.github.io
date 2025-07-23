const inputField = document.querySelector('input');

function restrictInput(event) {
    // if (event.key !== event.key.toUpperCase()) {
    //     event.preventDefault();
    // }
    if (!/^[A-Z]$/.test(event.key) && event.key !== "Backspace") {
        event.preventDefault();
    }
}

inputField.addEventListener('keydown', restrictInput);