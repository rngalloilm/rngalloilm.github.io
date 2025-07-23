# Activity 20.a: Creating a MariaDB Docker Container

In this activity, you will practice using a MariaDB container to create a database schema and populate it with data. You will also learn how to persist the database schema and data so that the container can be recreated without losing the changes made to the database.

## Activity Resources

1. [Docker Compose Documentation](https://docs.docker.com/compose/)
2. [Docker Compose CLI Reference](https://docs.docker.com/compose/reference/overview/)
3. [Docker Compose File Reference](https://docs.docker.com/compose/compose-file/)
4. [MariaDB Docker Image Documentation](https://hub.docker.com/_/mariadb)
5. MySQL/MariaDB Desktop Clients
    * [HeidiSQL](https://www.heidisql.com/)
    * [MySQL Workbench](https://www.mysql.com/products/workbench/)
    * [Sequel Pro](https://www.sequelpro.com/)
6. Assets
   * [Database Schema - Physical Model](files/ncparks_schema.png)
   * [Initial Data (SQL)](files/02-data.sql)

## Task 1: Setting Up the Folder Structure

In this task, you will initialize the folder structure for this activity.

### Steps

1. Create a new folder in your repository's Scratch Pad under today's folder for this activity.
2. In this folder, create an empty file called `.env`. We will use this file to store environment variables for the project later.
3. Create a `.gitignore` file in the project folder and exclude the `.env` file from version control. We are doing this to avoid accidentally committing sensitive information to the repository.
    ```
    .env
    ```
3. Create a new file called `compose.yml` in the project folder.
4. Create a new folder called `database` in the project folder.
5. In the `database` folder, create a new folder called `db_schema` and a `.gitignore`. Add the following to the `.gitignore` file:
    ```
    data/
    ```

## Task 2: Creating a MariaDB Container

In this task, you will create a MariaDB container using Docker Compose and configure it with environment variables stored in a `.env` file.

### Steps
1. Open the `.env` file in the project folder and populate it with the following environment variables:
    ```env
    MYSQL_ROOT_PASSWORD=my_root_pass
    MYSQL_DATABASE=ncparks
    MYSQL_USER=ncparksuser
    MYSQL_PASSWORD=ncparks_user_password
    ```
    * The variable `MYSQL_ROOT_PASSWORD` will set the password for the `root` user in the database, which has full administrative access to the entire database server.
    * The variable `MYSQL_DATABASE` will create a database schema with the name provided.
    * The variable `MYSQL_USER` will create a user with this name and grant it access to the database created with `MYSQL_DATABASE`.
    * The variable `MYSQL_PASSWORD` will set the password for the user created with `MYSQL_USER`.
2. Open the `compose.yml` file in the project folder. Add the `services` section with a service called `database`.
3. In the `database` service, set the `image` to `mariadb`. This will use the MariaDB image from Docker Hub rather than building a custom image for this container.
4. Set the restart policy for the container to `unless-stopped`. This will restart the container automatically if it stops unexpectedly or if the host machine restarts (but not if the container is stopped manually).
5. The container will listen on port `3306` in the Docker network. Forward port `3307` on the host machine to port `3306` on the container so that we can easily connect to the database from the host machine.
6. Add the `.env` file to the database service via the `env_file` section. This will load the environment variables from the `.env` file into the container.
    ```yml
    env_file:
      - .env
    ```
7. Start the MariaDB container by running the compose stack in the project folder.
    ```bash
    docker compose up
    ```
    Inspect the output as the container is created and the database is initialized. If all goes well, you will see messages saying that the database and user were created and that the server is ready to accept connections. 

## Task 3: Connecting to the Database and Initializing the Schema

In this task, you will connect to the MariaDB container with a desktop client and create the tables for the parks domain in.

### Steps

1. Install a MySQL/MariaDB desktop client on your host machine. You can use any of the following:
    * [HeidiSQL](https://www.heidisql.com/) - Windows only (or Linux via Wine)
    * [MySQL Workbench](https://www.mysql.com/products/workbench/) - Windows, MacOS, and Linux
    * [Sequel Pro](https://www.sequelpro.com/) - MacOS only
2. Open your MySQL/MariaDB client of choice and connect to the database. You can use the following connection details:
    * Host: `localhost`
    * Port: `3307`
    * User: `ncparksuser`
    * Password: `ncparks_user_password`
3. In the `ncparks` database, create the tables and relationships for the parks domain following the schema below. The specific steps for how to do this will depend on the client you are using.
    ![Database Schema](files/ncparks_schema.png)
4. After creating the tables, if your schema was created properly, you should be able to populate the tables with data by running the SQL commands in the provided `02-data.sql` file via your desktop client. The steps to do this will depend on the client you are using.

## Task 4: Persisting and Restoring the Database's Initial State

In this task, you will persist the database schema to a file in the `database/db_schema` folder and restore it when the container is run for the first time.

### Steps

1. Using your database client of choice, export the schema for the `ncparks` database to a file in the `database/db_schema` folder. Name the file `01-schema.sql`. You will want to export only the tables, not the data or the database itself (since the database is created by Docker and the data is provided in a separate file). This file will contain the SQL commands to create the tables and relationships in the database.
2. After making sure that you have already exported your schema properly, stop and delete your database container.
3. Start the MariaDB container again by running the compose stack in the project folder and connect to it using your desktop client. You will find that the `ncparks` database will be there, but it will be empty.
4. Stop and delete your database container again.
5. Open the `compose.yml` file in the project folder and add a volume to the `database` service that maps the `database/db_schema` folder to the `/docker-entrypoint-initdb.d` folder in the container. This make the files in the `db_schema` folder available in the container when it runs, and the MariaDB image will run these SQL files to initialize the database the first time the container runs.
6. Start the MariaDB container again by running the compose stack in the project folder. You will find that the `ncparks` database will be created with the tables and relationships defined in the `01-schema.sql` file and the data from the `02-data.sql` file.


## Task 5: Persisting and Restoring the Database Data

In this task, you will persist the data for the `ncparks` database so that the container can be recreated without losing the changes made to the database.

### Steps

1. Using your database client of choice, create records for new couties and/or new parks. Remember what these are.
2. Stop and delete your database container.
3. Start the MariaDB container again by running the compose stack in the project folder and connect to it using your desktop client. You will find that the `ncparks` database will be there, and it will contain the initial schema and data, but it will not contain the records you created in the previous step.
4. Stop and delete your database container again.
5. Open the `compose.yml` file in the project folder and add a volume to the `database` service that maps the `database/data` folder to the `/var/lib/mysql` folder in the container. This will make the database files in the `data` folder available in the container, even when it runs the first time. This will allow the container to persist the data across restarts without having to start from scratch every time.
6. Start the MariaDB container again by running the compose stack in the project folder. You will find that the `ncparks` database will be created with the initial data.
7. Using your database client of choice, create some more records for new counties and/or new parks.
8. Stop and delete your database container.
9. Start the MariaDB container again by running the compose stack in the project folder and connect to it using your desktop client. You will find that the `ncparks` database will be there, and it will contain the initial schema and data, as well as the records you created in the previous step.