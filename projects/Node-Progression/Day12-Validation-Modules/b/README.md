# Activity 12.b: JavaScript Validation and JavaScript Modules

In this activity, you will modify the Express.js application from the previous activity to replace the built-in form validation with custom client-side validation using JavaScript. You will also validate submitted data on the server.

## Activity Resources

1. [`<form>` element on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)
2. [MDN Web Docs: HTML Forms](https://developer.mozilla.org/en-US/docs/Learn/Forms)
3. [MDN Web Docs: Form Validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)
4. [MDN Web Docs: Constraint Validation](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation)
5. [MDN Web Docs: Validity State](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState)

## Task 1: Disabling Built-in Validation

In this task, you will copy over the files from the previous activity and you will disable the built-in form validation for the registration form in the `form.html` file.

### Steps

1. Create a new folder in your repository's Scratch Pad under today's folder for this activity.
2. Copy all files except the `node_modules` folder from the previous activity to the new folder. You will have to run `npm install` to install the dependencies in this folder again.
3. Open the `form.html` file in the `templates` folder.
4. Add the `novalidate` attribute to the `<form>` element to disable the built-in form validation.
5. Start the server and load this page in the browser to verify that the form elements are no longer validated by the browser. The CSS validation cues you added in the previous activity will still be displayed.

## Task 2: Server-Side Validation

In this task, you will validate the registration form data on the server by creating a validation module.

### Steps

1. Create an error HTML file called `error.html` in the `templates` folder. This file should contain a simple error message. You can use the contents of the `success.html` file as a template.
2. In the `src` folder, create a JavaScript file called `validation.js`.
3. In `validation.js`, create a function called `validateRegistration` that takes the request body object as an argument and is exported as the default CommonJS module. This function will return `false` if the data is invalid, and `true` otherwise.
    ```js	
    module.exports = function validateRegistration(body) {
      let valid = true;
      let errors = [];

      // Your validation logic here

      if (!valid) {
        console.log(errors);
        return false;
      }
      return true;
    };
    ```
4. In `index.js`, import the `validateRegistration` function from `validation.js`.
    ```js
    const validateRegistration = require('./validation');
    ```
5. In the POST route handler for `/register`, call the `validateRegistration` function with the request body as an argument. If the function returns `false`, respond with a status code of `400` and the error page. Otherwise, respond with the `received.html` file.
6. Submit the form in the browser and verify that the server is validating the data as expected. If the constraints are not met, you should see the error page.

## Task 3: Custom Client-Side Validation

In this task, you will add custom client-side validation to the registration form in the `form.html` file using JavaScript with the Constraint Validation API.

### Steps

1. Create the `public/js` folder, and create two JavaScript files called `register.js` and `formValidation.js` in this folder.
2. Link `register.js` to `form.html`, specifying that the script will use the `module` type. Do not link any other JavaScript files to your HTML.
3. In `formValidation.js`, create function called `validateForm` that takes an event object as an argument.
4. Export the `validateForm` function from `formValidation.js` as the default export using ESM syntax.
    ```js	
    export default function validateForm(event) {
      // Your validation logic here
    }
    ```
5. In `register.js`, import the `validateForm` function from `formValidation.js` and register it to handle the form's `submit` event.
    ```js	
    import validateForm from './formValidation.js';

    const form = document.querySelector('form');
    form.addEventListener('submit', validateForm);
    ```
6. Implement your validation logic in the `validateForm` function. The following steps will guide you through the process:
   * Add constants to store each form element that requires validation.
   * Use the `checkValidity()` method on each form element to check if it is valid. This method returns `true` if the element meets all constraints, and `false` otherwise.
   * If any form element is invalid, display a custom error message on the element by calling its `setCustomValidity()` method. For example:
      ```js
      if(!username.checkValidity()) {
        username.setCustomValidity('Username must be at least 5 characters long and consist of lowercase letters only.');
      }
      ```
   * **Important:** the `checkValidity()` method will fail if a form element has a custom error message, so you will need to reset the custom error message before checking its validity (*i.e.*, set it to `null` or `""`).
   * For the password, you will need to verify that the password is valid and that it matches the confirm password field.
   * Finally, if there are any validation errors, call `reportValidity()` on the form to display the error messages and call `preventDefault()` on the event object to prevent the form from being submitted.
7. Refresh this page in the browser and verify that the form elements are validated according to the constraints. If everything works as expected, the browser will display your custom error messages if the constraints are not met, one at a time.