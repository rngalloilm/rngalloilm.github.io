# Activity 10.a: Basic Full-Stack App

In this activity we are going to create a simple Express application that serves CSS statically and serves HTML behind a route.

## Activity Resources

1. [Express Route Handler Documentation](https://expressjs.com/en/4x/api.html#app.METHOD)
2. [Node `path` Module](https://nodejs.org/api/path.html)
3. [`nodemon` Documentation](https://www.npmjs.com/package/nodemon)
4. Assets
   * [Starter Files](files/)

## Task 1: Setting Up the Folder Structure

In this task, you will create a new Node.js project and set up the folder structure for the Express application using the files provided to you.

### Steps

1. Create a new folder in your repository's Scratch Pad under today's folder for this activity.
2. Initialize a new Node.js project in the folder:
   ```bash
   npm init -y
   ```
3. Install Express as a dependency:
   ```bash
    npm install express
    ```
    This will install Express.js in the `node_modules` folder and add it as a dependency in the `package.json` file.
4. Edit the `package.json` file and add a `start` script to run the Node.js application:
   ```json
   ...
   "scripts": {
     "start": "node app.js"
   }
   ...
   ```
5. Copy the provided `app.js` file to the project folder. The `app.js` file contains the code to create a simple Express.js server that listens on port 3000. You'll modify this file later.
6. Create a new folder called `static` and another one called `templates` in the project folder.
7. Copy the provided `index.html` file to the `templates` folder.
8. Inside the `static` folder, create two folders: `css` and `js`.
9. Copy the provided `styles.css` file to the `css` folder.
10. Copy the provided `script.js` file to the `js` folder.

You should now have the following folder structure:

```
/
├── node_modules
├── static
│   ├── css
│   │   └── styles.css
│   └── js
│       └── script.js
├── templates
|    └── index.html
├── app.js
├── package.json
└── package-lock.json
```

## Task 2: Serving Static Files

In this task, you will modify the `app.js` file to serve the CSS and JavaScript files statically.

### Steps

1. Open the `app.js` file in VS Code.
2. Attach the `express.static` middleware to your Express app, designating the `static` folder as the location for static assets:
   ```js
    app.use(express.static('static'));
    ```
3. Save the `app.js` file.
4. Open a terminal and navigate to the project folder.
5. Run the Express application:
   ```bash
   npm start
   ```
6. Open a web browser and navigate to `http://localhost:3000/css/styles.css` to verify that the CSS file is being served.
7. Open a web browser and navigate to `http://localhost:3000/js/script.js` to verify that the JavaScript file is being served.


## Task 3: Serving HTML Behind a Route

In this task, you will modify the `app.js` file to serve the `index.html` file behind a route. If you still have the server running from the previous task, you will notice that changes to `app.js` do not take effect until you restart the server. We'll fix this by using the `nodemon` package.

### Steps

1. Stop the server from the previous task by pressing `Ctrl + C` in the terminal.
2. Install `nodemon` as a development dependency:
   ```bash
   npm install --save-dev nodemon
   ```
3. Edit the `package.json` file and modify the `start` script to use `nodemon` to run the server:
   ```json
    ...
    "scripts": {
      "start": "nodemon -L app.js"
    }
    ...
    ```
    The `-L` flag is used to enable legacy watch mode. This is necessary for nodemon to work correctly in some environments (such as Docker on Windows).
4. Save the `package.json` file and close it.
5. Open the `app.js` file in VS Code.
6. Import the `path` module at the very top of the file:
   ```js
    const path = require('path');
    ```
7. Create a constant called `templatesPath` that references the `templates` folder:
   ```js
    const templatesPath = path.join(__dirname, 'templates');
    ```
8. Attach a route to your Express app that serves the `index.html` file when a `GET` request is made to the root path (`/`):
    ```js
      app.get('/', (req, res) => {
        res.sendFile(path.join(templatesPath, 'index.html'));
      });
    ```
9. Save the `app.js` file.
10. Run the Express application:
    ```bash
    npm start
    ```
11. Open a web browser and navigate to `http://localhost:3000` to verify that the `index.html` file is being served behind the route. The CSS and JavaScript files should be loaded as well.


## Task 4: Add Another Page

In this task, you will add another HTML page to the `templates` folder and serve it behind a route. Since we are using `nodemon`, you can make changes to the `app.js` file and see the changes reflected in the server without restarting it.

### Steps

1. Create a new file called `about.html` in the `templates` folder.
2. Initialize this file with the contents of the `index.html` file and modify the content so that instead of showing a list of howls it shows some other content.
3. Open the `app.js` file in VS Code.
4. Attach a route to your Express app that serves the `about.html` file when a `GET` request is made to the `/company/about` path:
    ```js
      app.get('/company/about', (req, res) => {
        res.sendFile(path.join(templatesPath, 'about.html'));
      });
    ```
5. Since this route is not the root path, you will need to modify the path of the CSS and JavaScript files in the `about.html` file to reflect the new path. You will want to use [relative paths](https://sitechecker.pro/what-is-absolute-and-relative-url/) for this. For example, change it from:
    ```html
    <link rel="stylesheet" href="css/styles.css">
    ```
    to:
    ```html
    <link rel="stylesheet" href="../css/styles.css">
    ```
6. Save files. You'll notice that the server automatically restarts when you save the `app.js` file.
7. Open a web browser and navigate to `http://localhost:3000/company/about` to verify that the `about.html` file is being served behind the route. The CSS and JavaScript files should be loaded as well.


## Task 5: Add a 404 Page

In this task, you will add a 404 page to the `templates` folder and serve it when a route that doesn't exist is requested.

### Steps

1. Create a new file called `404.html` in the `templates` folder.
2. Initialize this file with the contents of the `index.html` file and modify the content to show a 404 "Not Found" message.
3. Open the `app.js` file in VS Code.
4. Right before `app.listen()`, attach a new middleware to your Express app that serves the `404.html` file when a route that doesn't exist is requested:
    ```js
      app.all('*', (req, res) => {
        res.status(404).sendFile(path.join(templatesPath, '404.html'));
      });
    ```
    This works because Express executes middleware in the order they are attached. If a route is requested that doesn't match any of the routes attached to the app, this middleware will be executed. Notice that in addition to sending the file, we are also setting the HTTP status code of the response to `404`.
5. Save the `app.js` file.
6. Open a web browser and navigate to `http://localhost:3000/this-route-does-not-exist` to verify that the `404.html` file is being served when a route that doesn't exist is requested.