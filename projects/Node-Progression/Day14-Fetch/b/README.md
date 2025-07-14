# Activity 14.b: Posting New Howls

In this activity, you will add functionality to Howler to post new howls.

## Activity Resources

1. [Fetch API on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
2. [Promises on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
3. [JavaScript Modules on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
4. Assets
   * [Starter Files](files/)


## Task 1: Posting New Howls from the Frontend

In this task, you will copy over the files from the previous activity and implement frontend functionality to post new howls.

### Steps

1. Create a new folder in your repository's Scratch Pad under today's folder for this activity.
2. Copy all files except the `node_modules` folder from the previous activity to the new folder. You will have to run `npm install` to install the dependencies in this folder again.
3. Start the server and verify that you can access the app at `http://localhost:3000`.
4. Open the `index.html` file in the `templates` folder and find the `<div>` with `id="howlInput"`. It will contain a `<textarea>` and a button with `id="howlButton"`.
5. Open the `home.js` file in the `public/js` folder and find the comments for Task 5 to identify where to add your code for this task.
6. Get a reference to the `<textarea>` and call it `howlInput`, and another to the button and call it `howlButton`.
7. Add an event listener to `howlButton` that listens for the `click` event. In the event handler, do the following:
   1. Check the content of the `howlInput` field. If it is empty, return early (we don't want to post an empty string).
   2. Create an object called `data` with a property called `message` that is set to the value of the `howlInput`.
      ```js
      const data = {
        message: howlInput.value,
      };
      ```
   3. Use the HTTP client to make a POST request to `/howls` with the `data` object as the body of the request. Remember that the HTTP client has a `post` method that returns a promise that resolves with the parsed JSON object from the response.
   4. This promise will resolve with a howl object. When the promise resolves, call the `renderHowl` function passing the new howl object to display the new howl on the page. Then, clear the `howlInput` field by setting it to an empty string.
5. You should now be able to post new howls to the server. Right now the call will fail because the server is not set up to handle POST requests to `/howls`. You will implement this in the next task.


## Task 2: Handling Howl Creation on the Server

In this task, you will implement the server-side functionality to create a new howl.

### Steps

1. Open the file called `HowlDAO.js` in the `src/db` folder of your project.
2. Add a new method called `createHowl` to the exported object that takes the howl message string as parameter. This method should return a promise that resolves with the new howl object.
3. Inside of the promise, create a new howl object with the message and `"@student"` as user.
   ```js
   const newHowl = {
      user: '@student',
      message: message
    };
   ```
4. Add the new howl object to the `howls` array.
5. Resolve the promise with the new howl object.
6. Now in the `src/server.js` file, add the appropriate middleware to the Express app to process JSON-encoded request bodies and add the parsed JSON object to the body property of the request.
7. Create a new POST route handler for `/howls`.
8. Inside the route handler, call the `createHowl` method from the `HowlDAO` with the message from the request body. Remember that this method returns a promise that resolves with the new howl object.
9. When the promise resolves, respond with the new howl object as JSON.
10. Test the functionality by posting a new howl from the frontend. You should see the new howl appear on the page.
