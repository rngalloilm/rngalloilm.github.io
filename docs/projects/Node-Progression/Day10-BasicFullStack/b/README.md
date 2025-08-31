# Activity 10.b: Custom Logger Middleware

In this activity, we will containerize the full-stack application we built in the previous activity using Docker. We will create a Dockerfile to build an image for the application and run a container from the image using Docker Compose.

## Activity Resources

1. [Express Documentation](https://expressjs.com/en/api.html)
2. [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)
3. [Docker CLI Reference](https://docs.docker.com/engine/reference/commandline/cli/)
4. [Docker Compose Documentation](httpsdocs.docker.com/compose/)
5. [Docker Compose CLI Reference](https://docs.docker.com/compose/reference/overview/)
6. [Docker Compose File Reference](https://docs.docker.com/compose/compose-file/)


## Task 1: Containerize the Project

In this task, you will copy over the files from the previous activity and create a new Dockerfile to containerize the full-stack application.

### Steps

1. Create a new folder in your repository's Scratch Pad under today's folder for this activity.
2. Copy all files except the `node_modules` folder from the previous activity to the new folder.
3. Create a new file called `Dockerfile` in the project folder and open it in VS Code.
4. Use the LTS (Long Term Support) version of the Node.js image as base image.
5. Set the working directory in the image to `/app`.
6. Copy the `package.json` and `package-lock.json` files from your machine to the working directory in the image.
7. Install the dependencies for the application.
8. Copy the rest of the application code into the image.
9. Expose the port that the app runs on.
10. Specify the command to run the app when the container runs.


## Task 2: Create a Docker Compose File

In this task, you will create a Docker Compose file to build and run your image. In this case, we will have only one service.

### Steps

1. Create a new file called `compose.yml` in the project folder and open it in VS Code.
2. Initialize the Compose file with a preamble that defines a name for this Compose stack and adds an entry for the services.
3. Define a service called `app`. Use the `build` option to specify the path to the Dockerfile.
4. Forward port 3000 on the host to port 3000 on the container.
5. Mount the following files and folders to the correct paths in the container: `static`, `templates`, `app.js`. Hint: remember the working directory we set in the Dockerfile in the previous task.
6. Save the `compose.yml` file.
7. Open a terminal and navigate to the project folder.
8. Build the Docker image using Docker Compose:
    ```bash
    docker compose build
    ```
    This should successfully build your image. If it doesn't you need to go back and check your Dockerfile and Compose file.
9. Run the Docker container using Docker Compose:
    ```bash
    docker compose up
    ```
10. Open a web browser and navigate to `http://localhost:3000` to verify that the application is running.

## Task 3: Create a Custom Logger Middleware

In this task, you will create a custom middleware function that logs the request method and URL to the console for every incoming request.

### Steps

1. Create a new middleware function in `app.js` called `logger` that logs the request method and URL to the console.
    ```js
    // Custom logger middleware
    const logger = (req, res, next) => {
      console.log(`${req.method} ${req.url}`);
      next();
    };
    ```
2. Attach the `logger` middleware to your Express app before any route handlers.
    ```js
    // Attach the logger middleware
    app.use(logger);
    ```
3. Save the changes to the `app.js` file. Your application should automatically restart if you're using `nodemon`.
4. Open a web browser and navigate to `http://localhost:3000` to verify that the application is running. You should see the request method and URL logged to the console (Docker logs) for every incoming request to the homepage and the about pages.
