# Activity 14.a: Fetching Howls from the Server

In this activity, you will extend Howler to retrieve and render a list of howls on from the server.

## Activity Resources

1. [Fetch API on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
2. [`<template>` Element on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)
3. [Promises on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
4. [JavaScript Modules on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
5. Assets
   * [Starter Files](files/)


## Task 1: Setting Up the Folder Structure

In this task, you will initialize the provided Express project by installing the required dependencies and running the provided files.

### Steps

1. Create a new folder in your repository's Scratch Pad under today's folder for this activity.
2. Place the provided files in this new folder.
3. Install the required dependencies by running `npm install` in the terminal on this folder.
7. Start the server and verify that you can access the app at `http://localhost:3000`.

## Task 2: Serving Howls from the Backend

In this task, you will create a DAO and an endpoint to serve the list of howls from the backend.

### Steps

1. Create a new file called `HowlDAO.js` in the `src/db` folder of your project.
2. Import the list of howls from the `howls.json` file.
    ```js
    const howls = require('./howls.json');
    ```
3. As a property of the default export, create a method called `getHowls` that returns a promise that resolves with the list of howls.
    ```js
    module.exports = {
      getHowls: () => {
        return new Promise((resolve, reject) => {
          resolve(howls);
        });
      },
    };
    ```
4. Now in the `server.js` file, import the `HowlDAO`.
    ```js
    const HowlDAO = require('./db/HowlDAO');
    ```
5. Create a new GET endpoint at `/howls` that uses the `getHowls` method from the `HowlDAO` to serve the list of howls as JSON. Remember that this method returns a promise that resolves with the list of howls.
    ```js
    app.get('/howls', (req, res) => {
      HowlDAO.getHowls()
        .then(howls => {
          res.json(howls);
        });
    });
    ```
6. Make sure that your server is running and verify that you can access the list of howls at `http://localhost:3000/howls`.


## Task 3: Creating a Reusable HTTP Client

In this task, you will create an HTTP client object that uses the Fetch API to make GET and POST requests to a server.

### Steps

1. Create a new file called `HTTPClient.js` in the `public/js` folder of your project.
2. The responses we want to receive will contain JSON bodies. Create a function called `processJSONResponse` that takes a response object as a parameter and verifies that the request produced a successful response. If the response is successful, it parses the JSON representation of the response as an object. If it is not, it throws an error. We will use this function to process the responses from the server for every fetch call we make.
    ```js
    function processJSONResponse(res) {
      if(!res.ok) {
        throw new Error(`This request was not successful: ${res.statusText} (${res.status})`);
      }
      return res.json();
    };
    ```
3. Any fetch call can fail, so we want to centralize the error handling logic. Create another function called `handleError` that takes an error object as a parameter and logs the error to the console for debugging. We also want to make sure we propagate the error to the caller so they can handle it as needed by throwing the error again.
    ```js
    function handleError(err) {
      console.error('Error in fetch', err);
      throw err;
    };
    ```

4. Create a the basic structure of the HTTP client object and export it as the default export.
    ```js
    export default {
      get: (url) => {
        //Your code here
      },
      post: (url, data) => {
        //Your code here
      },
    };
    ```
5. Implement the `get` method so that it returns the result of a fetch call to the URL provided as parameter. Use the `processJSONResponse` and `handleError` functions to process the response and handle any errors.
    ```js
    get: (url) => {
      return fetch(url)
        .then(processJSONResponse)
        .catch(handleError);
    },
    ```
6. Now implement the `post` method so that it returns the result of a fetch call to the URL provided as parameter. This time, you will need to configure the fetch call to send a POST request, send the `data` parameter as a JSON string in the body, and set the `Content-Type` header to `application/json`. Use the `processJSONResponse` and `handleError` functions to process the response and handle any errors as before.

We will use this HTTP client to make requests to the server in the next tasks. Your implementation of this file should be around 30 lines of code.


## Task 4: Displaying Howls on the Frontend

In this task, you will use the HTTP client from the previous task to call the `/howls` endpoint and display the list of howls on the frontend.

### Steps

1. Open the `index.html` file in the `templates` folder and find the `<template id="howlTemplate">` element. This template will be used to create an HTML instance for each howl. You will also find a `<div id="howlList">` element that will contain all the howls.
2. Open the `home.js` file in the `public/js` folder. You will see some starter code that imports the script to toggle Howler's dark mode.
3. Import the HTTP client object you created in the previous task as `HTTPClient`.
4. Get a reference to the `howlList` and the `howlTemplate` elements in the DOM.
    ```js
    const howlList = document.getElementById('howlList');
    const howlTemplate = document.getElementById('howlTemplate');
    ```
5. Create a function called `renderHowl` that receives a howl object as a parameter. In this function you will:
   1. Instantiate (clone) the howl template and get a reference to the howl container element
      ```js
      const howlInstance = howlTemplate.content.cloneNode(true);
      const howlElement = howlInstance.querySelector('.howl.container');
      ```
   2. Populate the user and content HTML blocks in the template with the values from the howl. Remember that each howl will have the following structure:
      ```js
      {
        "user": "@student",
        "message": "I love howling at the moon!",
      }
      ```
   3. Prepend the howl element to the howl list container so that the most recent howl (the last one on the list) is displayed at the top.
      ```js
      howlList.prepend(howlElement);
      ```
6. Still in `home.js`, but outside of the `renderHowl` function, use the HTTP client to make a GET request to the `/howls` endpoint. Remember that the HTTP client has a `get` method that returns a promise that resolves with the parsed JSON object from the response.
7. When this promise resolves, iterate over the list of howls and call the `renderHowl` function for each howl.
8. Refresh the page in the browser and verify that the list of howls is displayed correctly.
