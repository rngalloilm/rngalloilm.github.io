# Activity 09.a: A Basic Express HTTP Server Project

In this activity, you will create a simple Node.js application that serves a static HTML page using Express.js. You will create a new Node.js project, install Express.js as a dependency, and run the application to verify that it is working.

## Activity Resources

1. [Express.js Documentation](https://expressjs.com/)
2. [Node.js Documentation](https://nodejs.org/)
3. [npm Documentation](https://docs.npmjs.com/)
4. Assets
   * [Starter Files](files/)

## Task: Create and Run an Express Application

In this task, you will create a simple Node.js application that serves a static HTML page using Express.js. You are given a starter Node.js application that serves a static HTML page using Express.js. You will create initialize an NPM project, install Express.js as a dependency, and run the application to verify that it is working. Don't worry if you don't understand all the code in the starter application. You will learn more about Express.js later in the class.

### Steps

1. Create a new folder in your repository's Scratch Pad under today's folder for this activity.
2. Initialize a new Node.js project in the folder:
   ```bash
   npm init -y
   ```
3. Install Express.js as a dependency:
   ```bash
    npm install express
    ```
    This will install Express.js in the `node_modules` folder and add it as a dependency in the `package.json` file.
4. Copy the starter `app.js` file and the `public` folder to the project folder. The `app.js` file contains the code to create a simple Express.js server that listens on port 3000 and serves a static HTML page. The `public` folder contains the `index.html` file with the content to be served by the server.
5. Open the `package.json` file and add a `start` script to run the Node.js application:
    ```json
    ...
    "scripts": {
      "start": "node app.js"
    }
    ...
    ```
6. Run the Node.js application:
    ```bash
    npm start
    ```
    This will start the Express server and remain running listening for connections.
7. Open a web browser and navigate to `http://localhost:3000` to verify that the application is running.
8. To close the server, press `Ctrl + C` in the terminal where the server is running.





