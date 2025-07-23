# Activity 11.a: Forms & Form Elements

In this activity you will create a simple HTML form with various form elements and submit it to an Express.js server.

## Activity Resources

1. [`<form>` element on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)
2. [MDN Web Docs: HTML Forms](https://developer.mozilla.org/en-US/docs/Learn/Forms)
3. [`<input>` element on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)
4. [`<select>` element on MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select)
5. [`<textarea>` element on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea)
6. Assets
   * [Starter Files](files/)




## Task 1: Setting Up the Folder Structure

In this task, you will create a new Express project and set up the folder structure.

### Steps

1. Create a new folder in your repository's Scratch Pad under today's folder for this activity.
2. Initialize a new Express project in the folder. Make sure to also install `nodemon` as a development dependency.
3. Place the provided files in the project folder. Make sure the folder structure looks like this:
   ```
   /
   ├── public
   │   └── css
   │       ├── base.css
   │       └── forms.css
   ├── templates
   │   ├── form.html
   │   └── received.html
   ├── index.js
   ├── package.json
   └── package-lock.json
   ```
4. Add a start script to the `package.json` file that will start the server using `nodemon`.
5. Configure the app to serve static files from the `public` folder.
6. Add a GET route handler for the root URL (`'/'`) that serves the `form.html` file.
7. Start the server and verify that you can access the page at `http://localhost:3000`.

## Task 2: Frontend

In this task, you will populate the three forms in `form.html` file with various forms and form elements.

### Steps

1. Open the `form.html` file in the `templates` folder. You will encounter three empty forms.
2. Configure the first form to submit a `GET` request to `/submit/get`.
3. Configure the second form to submit a `POST` request to `/submit/post/url` using the `application/x-www-form-urlencoded` encoding.
4. Configure the third form to submit a `POST` request to `/submit/post/multipart` using the `multipart/form-data` encoding.
5. Add the following form elements with a respective `<label>` to the first form. For example:
   ```html
   <label for="mytext">Text Input:</label>
   <input type="text" id="mytext" name="mytext">
   ```
   * A text input field with the name and id of `mytext`
   * A password input field with the name and id of `mypassword`
   * An email input field with the name and id of `myemail`
   * A number input field with the name and id of `mynumber`
   * A date input field with the name and id of `mydate`
   * A text area with the name and id of `mytextarea`
   * A radio button group with the name of `myradio` and two radio buttons: `Option 1` and `Option 2`, with values `radio1value` and `radio2value`, respectively.
      ```html
      <div>
         <input type="radio" id="myradio1" name="myradio" value="radio1value">
         <label for="myradio1">Radio Option 1</label>
         <input type="radio" id="myradio2" name="myradio" value="radio2value">
         <label for="myradio2">Radio Option 2</label>
         <input type="radio" id="myradio3" name="myradio" value="radio3value">
         <label for="myradio3">Radio Option 3</label>
         </div>
      ```
   * A checkbox with the name and id of `mycheckbox`
      ```html
      <div>
        <input type="checkbox" id="mycheckbox" name="mycheckbox">
        <label for="mycheckbox">Checkbox:</label>
      </div>
      ```
   * A select element with the name and id of `myselect`, and three options: `Option 1`, `Option 2`, and `Option 3`, with values `option1value`, `option2value`, and `option3value`, respectively.
   * A submit button. You don't need a separate label for this one.
     ```html
     <input type="submit" value="Submit">
     ```
6. Copy these form elements to the second and third forms. You will need to change the ids of the form elements (and respective label references) to differentiate them between the forms.

## Task 3: Backend

In this task, you will create route handlers in `index.js` to handle the form submissions and print the submitted data to the console.

### Steps

1. Install `multer` as a dependency in the project.
2. Open the `index.js` file in the project folder.
3. Add middleware to the Express app to parse URL-encoded form data.
   ```js
   app.use(express.urlencoded({ extended: true }));
   ```
4. Import the `multer` module at the top of the file and configure it to store files in the `uploads` folder.
   ```js
   const multer = require('multer');
   const upload = multer({ dest: 'uploads/' });
   ```
5. Create a route handler for the `GET` request to `/submit/get` that logs the query string parameters to the console.
6. Create a route handler for the `POST` request to `/submit/post/url` that logs the form data in the body to the console.
7. Create a route handler for the `POST` request to `/submit/post/multipart` that logs the form data in the body to the console. You will need to add the `upload.none()` middleware to this route handler to handle the `multipart/form-data` encoding.
8. For each of the route handlers, serve the `received.html` file before or after printing the form data to the console.
9. Start the server (or refresh the page if the server is already started).
10. Enter data into the forms and submit them. Verify that you can submit the forms and see the data printed to the console for all 3 forms (one at a time).


## Bonus Task: Containerize your Express App

For this bonus task, you will have to create a Dockerfile to containerize your Express app and a `compose.yml` file to run it in a Docker Compose stack. Make sure you mount the appropriate volumes to allow for changes to your app to be automatically reflected in the container, and to forward the appropriate ports to access your app from the host machine.