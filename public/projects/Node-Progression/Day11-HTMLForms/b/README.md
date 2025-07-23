# Activity 11.b: File Uploads with Multer

In this activity, you will extend the Express.js application from the previous activity to handle file uploads using the Multer middleware.

## Activity Resources

1. [Express Route Handler Documentation](https://expressjs.com/en/4x/api.html#app.METHOD)
2. [Multer Documentation](https://www.npmjs.com/package/multer)
3. [File `<input>` element on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file)


## Task 1: Adding Our New Forms

In this task, you will copy over the files from the previous activity and you will add two new forms to the `forms.html` file in the `templates` folder.

### Steps

1. Create a new folder in your repository's Scratch Pad under today's folder for this activity.
2. Copy all files except the `node_modules` folder from the previous activity to the new folder. You will have to run `npm install` to install the dependencies in this folder again.
3. Open the `forms.html` file in the `templates` folder.
4. Add the following HTML between the last `</div>` and the closing `</body>` tag:
    ```html
    <div class="container">
      <form>
        <h2>POST Single File</h2>

      </form>

      <form>
        <h2>POST Multiple Files</h2>

      </form>
    </div>
    ```
5. Configure the first form to send a POST request to `/submit/post/file` and set the `enctype` attribute to `multipart/form-data`.
6. Configure the second form to send a POST request to `/submit/post/files` and set the `enctype` attribute to `multipart/form-data`.
7. Add some or all of the form elements from the previous forms to both of these forms.
8. Make sure that both forms include a submit button at the end, just like in the previous forms.
9. Save the changes to the `forms.html` file and make sure you can see the new forms when you open the page in a web browser.


## Task 2: Handling a Single File Upload

In this task, you will add a file `<input>` element to the first new form and handle the file upload on the backend using the Multer middleware.

### Steps

1. Create a folder called `uploads` in the project folder (if it's not already there).
2. Open the `form.html` file in the `templates` folder.
3. Add a file `<input>` element to the first new form with the name and id of `myfile` right before the submit button.
4. In your backend, create a route handler for the `POST` request to `/submit/post/file` with `upload.single('myfile')` as middleware to handle the `multipart/form-data` encoding of the body and the file upload. In this route handler, print the body and the metadata for the uploaded file (`req.file`) to the console and respond to the request by serving the `received.html` file.
5. Start the server (or refresh the page if the server is already started).
6. Enter data into the new form and submit it. Verify that you can submit the forms and see the data printed to the console with the contents of the body and the uploaded file. You should also now see the uploaded file in the `uploads` folder.


## Task 3: Handling Multiple File Uploads

In this task, you will add two file `<input>` element to the second new form and handle the file uploads on the backend using the Multer middleware.

### Steps

1. Open the `form.html` file in the `templates` folder.
2. Add a file `<input>` element to the second new form with the name and id of `myfile1` right before the submit button. Set the attribute `multiple` to allow multiple files to be selected on this input.
3. Add a second file `<input>` element to the second new form with the name and id of `myfile2` right before the submit button (after the previous input). Set the attribute `multiple` to allow multiple files to be selected on this input.
4. In your backend, create a route handler for the `POST` request to `/submit/post/files`. In this route handler, print the body and the metadata for the uploaded files (`req.files`) to the console and respond to the request by serving the `received.html` file.
    ```js
    // Handle file uploads
    app.post('/submit/post/files', upload.fields([
        {name: 'myfile1'},
        {name: 'myfile2'}
      ]), (req, res) => {
      console.log(req.body);
      console.log(req.files);
      res.sendFile(path.join(__dirname, 'templates', 'received.html'));
    });
    ```
5. Start the server (or refresh the page if the server is already started).
6. Enter data into the new form and submit it. Verify that you can submit the forms and see the data printed to the console with the contents of the body and the uploaded files. You should also now see the uploaded file in the `uploads` folder.

## Bonus Task: Containerize your Express App

For this bonus task, you will have to create a Dockerfile to containerize your Express app and a `compose.yml` file to run it in a Docker Compose stack. Make sure you mount the appropriate volumes to allow for changes to your app to be automatically reflected in the container, and to forward the appropriate ports to access your app from the host machine. You will want to make uploaded files accessible from outside of the container too, via a volume mount.