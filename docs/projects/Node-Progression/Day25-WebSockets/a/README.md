# Activity 25.a: A Real-Time Chat Application

In this activity, you will add WebSocket connectivity to a chat application to allow users to send and receive messages in real-time.

## Activity Resources

1. [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) on MDN
2. [`express-ws` Library Documentation](https://github.com/HenningM/express-ws)
3. Assets
   * [Starter Files](files/)

## Task 1: Setting Up the Folder Structure

In this task, you will initialize the provided Express project by installing the required dependencies and running the provided files.

### Steps

1. Create a new folder in your repository's Scratch Pad under today's folder for this activity.
2. Place the provided files in this new folder.
3. Install the `express-ws` library by running `npm install express-ws` in the terminal on this folder. This will also install all the dependencies required by the app from the `package.json` file.
4. Start the server and verify that you can access the app at `http://localhost:3000`.

## Task 2: Implementing the Backend WebSocket Logic

In this task, you will add WebSocket support to the Express app and implement the backend logic to handle WebSocket connections and messages.

### Steps

1. In the `server.js` file, require the `express-ws` library and initialize it with the Express app to configure WebSocket support.
  ```js
  const expressWs = require('express-ws')(app);
  ```
2. Create a new Express router called `websocketRouter` in a new file called `WebSocketRoutes.js` and export it.
3. Import and attach the router to the existing router in `routes.js` file.
4. Now back in the `WebSocketRoutes.js` file, do the following:
    1. Create a constant called `messages` to store the chat messages in the system and initialize it to an empty array.
    2. Create another constant called `clients` to store the WebSocket clients and initialize it to a new `Set`.
        ```js
        const clients = new Set();
        ```
    3. Create a helper function called `sendPacket` that accepts three parameters: `ws`, `label`, and `data`. The first parameter is the WebSocket client to send the message to, the second parameter identifies the type of message that we're trying to send, and the third parameter is the data to send.
        * We are going to define a data structure to transmit the data so that both frontend and backend can agree on how the data will be represented. We are going to send different types of data, so we need a way to identify what type of data a message contains. We can define a data `packet` that labels the data with the type of message and contains the data itself. This data structure will look like this:
            ```js
            let packet = {
              label: "string_label", //This will identify the nature of the data
              data: { ... }
            }
            ```
    4. In the body of the `sendPacket` function, do the following:
        1. Create a new object called `packet` that follows the structure above. The `label` property should be set to the value of the `label` parameter, and the `data` property should be set to the value of the `data` parameter.
        2. Call the `send` method on the WebSocket client `ws` and pass the JSON stringified version of the `packet` object.
    5. Now, in the `websocketRouter` router create a new WebSocket route on the `/ws` path. Remember that the callback function for WebSockets is different from the regular HTTP routes. When a new WebSocket connection is established, this method will be called with two parameters: the WebSocket client and the request object.
        ```js
        websocketRouter.ws('/ws', (ws, req) => {
          console.log('New client');
        });
        ```
    6. Inside the callback function, you will:
        1. Add the new client to the `clients` set. We want to keep track of all the clients that are connected to the WebSocket server so that we can let them all know of every incoming message.
        2. Notify this new client of all the messages that have been sent so far by calling the `sendPacket` with the client, `"init"` as label, and the `messages` array as data.
        3. Add an event listener to the WebSocket client object for the `close` event. When a client disconnects, we want to remove it from the `clients` set. You can also add a log message to indicate that a client has disconnected for debugging purposes.
        4. Add an event listener to the WebSocket client object for the `message` event. Check the documentation of the `expres-ws` for how this event listener should be added. The event will receive the message as a parameter, which will be a JSON string following the data structure we defined earlier. In this event listener, you will:
            1. Parse the JSON string into an object called `packet`. Remember that this object will have a `label` property that identifies the type of message and a `data` property that contains the message itself.
            2. Add a `switch` statement to handle the different types of messages that can be received. The only type of message we will handle for now is the `"chat"` type.
            3. When the message is of type `"chat"`, add the data property of the packet (the message itself) to the `messages` array, then iterate over all clients to send the message data object you received (JSON string) to each of the clients we have, excluding the client that sent the message.

## Task 3: Implementing the Frontend WebSocket Logic

In this task, you will implement the frontend logic to establish a WebSocket connection to the server and handle receiving and sending chat messages.

### Steps

1. Open the `chat.js` file in the `static/js` folder. This file will have some starter code that handles GUI interactions, and some placeholder functions for you to complete. You will interact with the following existing code:
    * A button called `btnConnect` that will allow you to reconnect if the connection is lost. When a connection is established, we will disable this button and reenable it when the connection is lost.
    * A constant called `myName` that will store a random name for each user. This name comes from a provided `myRandomName()` function. Once a name is established, it will be stored in `localStorage` so that the same name is used if the browser is refreshed.
    * A function called `renderMessage` that will add a new message HTML to the chat window. This is used when we post a message or when we receive a message via the WebSocket from someone else. It will check if the name of the sender is the same as `myName` to style the message differently if it was sent by the user.
2. Find the `init` function in the file. This function will be called when we receive existing messages from the server when we connect, so that we can recover the chat history. In this function you will: 
    1. Iterate over the messages array that is passed as a parameter. Each message will be an object with the following structure:
        ```js
        {
          name: "SomeName",
          message: "This is the message text",
          timestamp: Date
        }
        ```
    2. For each message, call the `renderMessage` function with the message object as parameter.
3. Find the `sendMessage` function. This function will receive as a parameter the message object as described above, and will send a `packet` object in the same format as we defined in the backend. In this function, do the following:
    1. Create a new object called `packet` with labe `"chat"` and the message object as the data.
    2. Call the `send` method on the WebSocket object `socket` with the JSON stringified version of the `packet` object.
4. Find the `connect` function. This function will be called when the user clicks the `btnConnect` button, and when we first load the page to connect the socket as soon as possible. In this function, you will:
    1. Create a constant called `scheme` that will be set to `"ws"` if the current page is served over HTTP, or `"wss"` if the current page is served over HTTPS. This is because the WebSocket connection should use the same protocol as the page.
        ```js
        const scheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
        ```
    2. Create a variable called `ws` that will be set to a new WebSocket object that connects to the `/ws` path of the current host and using the `scheme` variable to determine the protocol.
        ```js
        const ws = new WebSocket(`${scheme}://${window.location.host}/ws`);
        ```
    3. Add an event listener to the WebSocket object for the `open` event. When the connection is established, disable the `btnConnect` button.
    4. Add an event listener to the WebSocket object for the `error` event. When an error occurs, enable the `btnConnect` button, call the `close` method on the WebSocket object, and set the global `socket` variable to `null`.
    5. Add an event listener to the WebSocket object for the `close` event. When the connection is closed, enable the `btnConnect` button, and set the global `socket` variable to `null`.
    6. Add an event listener to the WebSocket object for the `message` event. The event object will have a `data` property that contains the message received from the server. In this event listener, you will:
        1. Parse the `data` property into an object called `packet`. Rember that we are expecting a JSON string that follows the data structure we defined earlier.
        2. Add a `switch` statement to handle the different types of messages that can be received. We can receive two types of messages: `"chat"` and `"init"`.
        3. When the message is of type `"init"`, call the `init` function with the data property of the packet (the messages array) as the parameter.
        4. When the message is of type `"chat"`, call the `renderMessage` function with the data property of the packet (the message object) as parameter.

## Task 4: Run and test the app

In this task, you will run the app and test the chat functionality by sending messages between two browser windows.

### Steps

1. In a terminal, run `docker compose up --build` to start the app.
2. Open a browser and navigate to `http://localhost:3000`. You should see the chat application and it should connect to the WebSocket server automatically. You can verify that this is the case by sending a message. The "Connect" button should be disabled, and you should see the message you sent appear in the chat window.
3. Open another browser (or an incognito window) and navigate to the same URL. You should see the chat application the message you sent in this window. You can also send a message from this window and see it appear in the other window.