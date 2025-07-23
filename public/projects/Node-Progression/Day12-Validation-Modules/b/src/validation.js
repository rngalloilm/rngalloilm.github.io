// This is server side validation
module.exports = function validateRegistration(body) {
    let valid = true;
    let errors = [];
  
    // Validate username: At least 5 lowercase letters
    if (!body.username || !/^[a-z]{5,}$/.test(body.username)) {
        errors.push("Username must be at least 5 lowercase letters.");
        valid = false;
    }

    // Validate password: At least 8 characters
    if (!body.password || body.password.length < 8) {
        errors.push("Password must be at least 8 characters long.");
        valid = false;
    }

    // Validate confirm password: Must match password
    if (!body['confirm-password'] || body['confirm-password'] !== body.password) {
        errors.push("Passwords do not match.");
        valid = false;
    }

    // Validate preferred language: Must be selected
    if (!body.language || body.language.trim() === "") {
        errors.push("Preferred language must be selected.");
        valid = false;
    }

    // Validate terms and conditions: Must be accepted
    if (!body.terms) {
        errors.push("You must accept the terms and conditions.");
        valid = false;
    }
  
    if (!valid) {
      console.log(errors);
      return false;
    }
    return true;
  };