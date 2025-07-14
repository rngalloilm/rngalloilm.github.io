# Activity 12.a: Client-Side Built-in Form Validation

In this activity, you will validate a form using the built-in form validation features of HTML5.

## Activity Resources

1. [`<form>` element on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)
2. [MDN Web Docs: HTML Forms](https://developer.mozilla.org/en-US/docs/Learn/Forms)
3. [MDN Web Docs: Form Validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)
4. [`:has` pseudo-class on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/:has)
5. [Express Route Handler Documentation](https://expressjs.com/en/4x/api.html#app.METHOD)
6. [Multer Documentation](https://www.npmjs.com/package/multer)
7. Assets
   * [Starter Files](files/)

## Task 1: Setting Up the Folder Structure

In this task, you will create a new Express project and set up the folder structure for this activity with the files provided.

### Steps

1. Create a new folder in your repository's Scratch Pad under today's folder for this activity.
2. Initialize a new Express project in the folder with `multer` as a dependency. Make sure to also install `nodemon` as a development dependency.
3. Place the provided files in the project folder. Make sure the folder structure looks like this:
   ```
   /
   ├── public
   │   └── css
   │       ├── base.css
   │       └── register.css
   ├── src
   │   └── index.js
   ├── templates
   │   ├── form.html
   │   └── success.html
   ├── package.json
   └── package-lock.json
   ```
4. Add a start script to the `package.json` file that will start the server using `nodemon`. Notice that our server file is now in the `src` folder.
5. Configure the app to serve static files from the `public` folder.
6. Add a GET route handler for the root URL (`'/'`) that serves the `form.html` file.
7. Start the server and verify that you can access the page at `http://localhost:3000`.

## Task 2: Built-in Form Validation

In this task, you will add built-in form validation to the registration form in the `form.html` file.

### Steps

1. Open the `form.html` file in the `templates` folder.
2. Configure the form to submit a `POST` request to `/register` using the `multipart/form-data` encoding.
3. Add validation constraints to the form elements in the registration form to satisfy the following requirements:
   * A username is required and must be at least 5 characters long consisting of only lowercase letters.
   * A password is required and must be at least 8 characters long.
   * The password and confirm password fields must match.
   * A preferred language must be selected.
   * The terms and conditions must be accepted.
   * Sign up for the newsletter is optional.
4. Refresh this page in the browser and verify that the form elements are validated according to the constraints. You will find that the browser will display error messages if the constraints are not met, one at a time. You will also find that built-in validation cannot check that the password and confirm password fields match. We will fix this in a separate activity.

## Task 3: Validation Cues

In this task, you will add validation cues via CSS to the form elements in the registration form.

### Steps

1. Open the `register.css` file in the `public/css` folder.
2. Add CSS rules to style the form elements based on their validation state, but only if they are required.
   * Make the border of the input fields green when they are valid.
   * Make the border of the input fields red when they are invalid.
   * You can use the `:has` pseudo-class to style the label that wraps the checkbox to add a 1px border.
3. Refresh the page in the browser and verify that the form elements are styled according to their validation state.

## Task 4: Handling Form Submission

In this task, you will handle the form submission on the backend and respond with a success message.

### Steps

1. In your backend, create a route handler for the `POST` request to `/register`.
2. Configure this route handler to use `multer` middleware to handle the `multipart/form-data` encoding of the body. We don't need to save a file in this activity.
3. Print the body of the request to the console and serve the `success.html` file as a response to the request.
4. Start the server (or refresh the page if the server is already started).
5. Enter valid data into the form and submit it. Verify that you can submit the form and see the data printed to the console only if the form is valid (other than confirming the password).