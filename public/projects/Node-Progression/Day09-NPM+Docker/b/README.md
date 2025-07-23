
# Activity 09.b: Containerize a Node.js App

In this activity, you will containerize the Express app from the previous activity using Docker. You will create a Dockerfile to build an image for the application and run a container from the image.


## Activity Resources

2. [Node.js Docker Official Images](https://hub.docker.com/_/node)
3. [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)
4. [Docker CLI Reference](https://docs.docker.com/engine/reference/commandline/cli/)
5. [Docker Compose Documentation](https://docs.docker.com/compose/)
6. [Docker Compose CLI Reference](https://docs.docker.com/compose/reference/overview/)
7. [Docker Compose File Reference](https://docs.docker.com/compose/compose-file/)

## Task 1: Containerize the Express App

Rather than running the app directly on our machines, we now want to create a Docker image with this app so that we can run it in a container. In this task, you will create a Dockerfile to build an custom Docker image for the Express app from the previous step.

### Steps

1. Create a new folder in your repository's Scratch Pad under today's folder for this activity.
2. Copy the `app.js`, `public`, and `package.json` files from the previous activity to the new folder. We do not need the `node_modules` folder as we will install the dependencies in the Docker image.
3. Create a new file called `Dockerfile` in the project folder and open it in VS Code.
4. We must first select a base image for our custom Docker image. Since this is a Node.js application, we will use the official Node.js image as the base image. Add the following content to the `Dockerfile` specify the Node image as base and use the image tagged as `lts` (Long Term Support) version:
    ```Dockerfile
    # Use the official Node.js image as the base image
    FROM node:lts
    ```
5. We will now extend the base image with our application code. The first thing we need to do is set the working directory in the image. This is the path in the image where our application will live. We'll set it to `/app`:
    ```Dockerfile

    # Set the working directory in the image
    WORKDIR /app
    ```
6. Next, we need to copy our app into this folder. Since our code will likely change more often that our dependencies, we will take advantage of Docker caching strategies by installing dependencies first. To do this, we will copy the `package.json` and `package-lock.json` files from our machines into the working directory of the image:
    ```Dockerfile
    # Copy package.json and package-lock.json to the working directory
    COPY package*.json ./
    ```
7. We can now install the dependencies for the application. We will run the `npm install` command to install the dependencies in the image:
    ```Dockerfile
    # Install dependencies
    RUN npm install
    ```
8. Now that we have installed the dependencies, we can copy the rest of the application code into the image:
    ```Dockerfile
    # Copy the application code to the working directory
    COPY . .
    ```
9. We need to expose the port that the app runs on. In our case, the app runs on port 3000, so we will expose that port:
    ```Dockerfile
    # Expose the port the app runs on
    EXPOSE 3000
    ```
10. Finally, we need to specify the command to run the app. In our case, we will run the `npm start` command to start the Express server:
    ```Dockerfile
    # Command to run the app
    CMD ["npm", "start"]
    ```
11. Save the `Dockerfile` and close the editor. This file is now the template for building the Docker image for our Express application.


## Task 2: Build the Image and Run a Container

Now that you have created the Dockerfile, you can use it to build a Docker image for the application. Once you have the image, you can run a container from the image to start the application.

### Steps

1. Build the Docker image using the `docker build` command in the terminal. The `-t` flag is used to tag the image with a name (`node-app` in this case):
    ```bash
    docker build -t node-app .
    ```
    This will create an image that starts with the contents of the Node.js base image, installs the dependencies for our application, and contains the code from our application.
2. Verify that the image was created successfully by listing the Docker images:
    ```bash
    docker images
    ```
    You should see the `node-app` image in the list.
3. Now that we have the image, we can create containers from it. Our application will listen for connections on port 3000 in the container, but we want to be able to access it from our host machine. We can map the port 3000 in the container to a port on the host machine using the `-p` flag:
    ```bash
    docker run -p 8080:3000 node-app
    ```
    We are specifying that we want to run a container from the `node-app` image and map port 8080 on the host machine to port 3000 in the container. This means that when we try to access port 8080 on our host machine, we will actually be communicating with port 3000 in the container.
4. Open a web browser and navigate to `http://localhost:8080` to verify that the application is running in the container. Notice that we are using the port we mapped (8080) even though the application is running on port 3000 in the container.



