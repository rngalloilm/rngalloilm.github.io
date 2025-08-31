# Activity 09.c: Running Containers with Docker Compose

In this activity you will create a Docker Compose stack to run multiple containers at once, building their images along the way if necessary.

## Activity Resources

1. [Docker Compose Documentation](https://docs.docker.com/compose/)
2. [Docker Compose CLI Reference](https://docs.docker.com/compose/reference/overview/)
3. [Docker Compose File Reference](https://docs.docker.com/compose/compose-file/)
4. Assets
   * [Starter Files](files/)

## Task 1: Create a Docker Compose File

In this task, you will create a Docker Compose file to define a stack of services that run multiple containers. You will define three services: an Nginx [reverse proxy](https://en.wikipedia.org/wiki/Reverse_proxy), an Express app that will be a stand-in for a backend service, and an Apache server that will represent the frontend.

### Steps

1. Create a new folder in your repository's Scratch Pad under today's folder for this activity.
2. Copy the starter files (`proxy` folder) to the new folder. The `proxy` folder contains the `default.conf.template` file that will be used as the Nginx configuration file.
3. Create a new file called `compose.yml` in the project folder and open it in VS Code.
4. First, start with a preamble that defines a name for this Compose stack and adds an entry for the services:
    ```yaml
    name: activity09c

    services:
    ```
5. Define the first service, `proxy`, in the `compose.yml` file. Make sure that this is nested under `services`. We will use the official Nginx image as the base image and forward port 80 on the host to port 80 on the proxy container. We are also goint to mount the provided Nginx configuration file into the location in the container where Nginx will look for it:
    ```yaml
      proxy:
        image: nginx:latest # Use a pre-built image from Docker Hub
        restart: unless-stopped
        ports:
          - "80:80"
        volumes:
          - ./proxy/default.conf.template:/etc/nginx/templates/default.conf.template
    ```
6. Create a new folder called `backend` in the project folder and copy the files from the previous activity: `app.js`, `Dockerfile`, the `public` folder, and `package.json`.
7. Define the second service, `backend`, in the `compose.yml` file. This service will use a custom image built from our Dockerfile. We will also mount some volumes so that we can change the code dynamically without rebuilding the image:
    ```yaml
      backend:
        build: ./backend # Use the Dockerfile in the backend folder to build the image, instead of using one from Docker Hub
        restart: unless-stopped
        volumes:
          - ./backend/app.js:/app/app.js
          - ./backend/public:/app/public
    ```
    Important Notes:
      * Notice that we are not forwarding any ports. We don't need to because we are not accessing this container directly. Instead, we are connecting only to the Nginx reverse proxy and this proxy will reach out to the backend container for us. Since both containers automatically get placed into the same private Docker network, they can communicate with each other.
      * We are mounting the `app.js` and `public` files from the `backend` folder into the container, and not the entire `backend` folder. This is because the image will have dependencies installed in the `node_modules` folder that we don't want to overwrite.
8. Create a new folder called `frontend` in the project folder and create a file called `index.html` in it. Add some content to the file to represent a simple frontend.
9. Define the third service, `frontend`, in the `compose.yml` file. This service will use the official Apache image as the base image and will mount the `frontend` folder into the container:
    ```yaml
      frontend:
        image: httpd:latest # Use a pre-built image from Docker Hub
        restart: unless-stopped
        volumes:
          - ./frontend:/usr/local/apache2/htdocs
    ```
    Important Notes:
      * Notice that we are not forwarding any ports. We don't need to because we are not accessing this container directly. Instead, we are connecting only to the Nginx reverse proxy and this proxy will reach out to the backend container for us. Since both containers automatically get placed into the same private Docker network, they can communicate with each other.
      * We are mounting the `frontend` folder into the container to a path where Apache will look for static resources to serve. Any files we place here will be served by the Apache server.
10. Save the `compose.yml` file.
11. Open a terminal and navigate to the project folder. This folder should now look like this:
    ```
    /
    ├── backend/
    │   ├── app.js
    │   ├── Dockerfile
    │   ├── public/
    │   │   └── index.html
    ├── frontend/
    │   └── index.html
    ├── proxy/
    │   └── default.conf.template
    └── compose.yml
    ```
12. Run the following command to start all the services defined in the `compose.yml` file at once:
    ```bash
    docker compose up
    ```
    This will download the necessary images from Docker Hub, build the custom image for the backend service, and start all the services. You will see the logs from all the services in the terminal.
13. Open a web browser to verify that everything is running. Navigating to `http://localhost` should show the content served by the `frontend` service and navigating to `http://localhost/api` should show the content served by the `backend` service. The Nginx reverse proxy is routing requests to the appropriate service based on the path.


## Task 2: Stop and Remove the Containers

Once you have verified that everything is running, you can stop the containers and remove them.

### Steps

1. Press `Ctrl + C` in the terminal where the services are running to stop them.
2. Run the following command to remove the containers:
    ```bash
    docker compose down
    ```
    This will stop and remove the containers, but it will not remove the images that were built. You can verify this by running `docker images` and checking that the images are still there.


## Task 3: Run the Compose Stack in Detached Mode

In this task, you will run the Docker Compose stack in detached mode so that the services run in the background, even if you close the terminal.

### Steps

1. Run the following command to start the services in detached mode:
    ```bash
    docker compose up -d
    ```
    This will start the services in the background and return you to the terminal prompt.
2. Open a web browser to verify that everything is running. Navigating to `http://localhost` should show the content served by the `frontend` service and navigating to `http://localhost/api` should show the content served by the `backend` service.
3. Run the following command to stop and remove the containers:
    ```bash
    docker compose down
    ```
    This will stop and remove the containers, but it will not remove the images that were built. You can verify this by running `docker images` and checking that the images are still there. You could also run `docker compose stop` to stop the services without deleting the containers.