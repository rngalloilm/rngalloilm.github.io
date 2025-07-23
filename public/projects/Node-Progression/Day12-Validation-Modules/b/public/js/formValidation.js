export default function validateForm(event) {
    // Prevent form submission if validation fails
    event.preventDefault();

    // Select form elements
    const form = event.target;
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm-password");
    const language = document.getElementById("language");
    const terms = document.getElementById("terms");

    // Reset custom validity messages
    username.setCustomValidity("");
    password.setCustomValidity("");
    confirmPassword.setCustomValidity("");
    language.setCustomValidity("");
    terms.setCustomValidity("");

    let isValid = true;

    // Username validation
    if (!username.checkValidity()) {
        username.setCustomValidity("Username must be at least 5 characters long and consist of lowercase letters only.");
        isValid = false;
    }

    // Password validation
    if (!password.checkValidity()) {
        password.setCustomValidity("Password must be at least 8 characters long.");
        isValid = false;
    }

    // Confirm password validation
    if (confirmPassword.value !== password.value) {
        confirmPassword.setCustomValidity("Passwords do not match.");
        isValid = false;
    }

    // Language selection validation
    if (!language.checkValidity()) {
        language.setCustomValidity("Please select a preferred language.");
        isValid = false;
    }

    // Terms and conditions validation
    if (!terms.checked) {
        terms.setCustomValidity("You must agree to the terms and conditions.");
        isValid = false;
    }

    // Display error messages
    if (!isValid) {
        form.reportValidity();
    } else {
        form.submit(); // Submit the form if validation passes
    }
}
