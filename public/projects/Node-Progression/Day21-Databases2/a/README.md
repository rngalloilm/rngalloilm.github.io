# Activity 21.a: A Database for the NC Parks App

In this activity, you will modify our NC Parks app to use a MariaDB database instead of JSON files to store the data.

## Activity Resources

1. [Docker Compose Documentation](https://docs.docker.com/compose/)
2. [Docker Compose CLI Reference](https://docs.docker.com/compose/reference/overview/)
3. [Docker Compose File Reference](https://docs.docker.com/compose/compose-file/)
4. [MariaDB Docker Image Documentation](https://hub.docker.com/_/mariadb)
5. MySQL/MariaDB Desktop Clients
    * [HeidiSQL](https://www.heidisql.com/)
    * [MySQL Workbench](https://www.mysql.com/products/workbench/)
    * [Sequel Pro](https://www.sequelpro.com/)
6. [MariaDB SQL Documentation](https://mariadb.com/kb/en/sql-statements/)
    * [Data Definition Statements](https://mariadb.com/kb/en/data-definition/)
    * [Data Manipulation Statements](https://mariadb.com/kb/en/data-manipulation/)
7. Assets
   * [Starter Files](files/)

## Task 1: Setting Up and Configuring the Project

In this task, you will initialize the folder structure for this activity and populate necessary environment variables.

### Steps

1. Create a new folder in your repository's Scratch Pad under today's folder for this activity.
2. Place the provided files in this new folder.
3. Create a file called `.env` and populate it with the contents of the provided `.env.example` file.
4. Populate the environment variables in the `.env` file as follows:
    * `MYSQL_ROOT_PASSWORD`: set it to `my_root_pass`. This will set the password for the `root` user in the database, which has full administrative access to the database.
    * `MYSQL_PASSWORD`: set it to `ncparks_user_password`. This will set the password for the `ncparksuser` user.
    * `DB_HOST`: set it to the name of the service of the database container in the Docker Compose file. The hostname of containers in a Compose file is the name of the service.
    * `DB_PORT`: set it to `3306` as this is the default port for MariaDB. Notice that this is the port the container listens on, not the port we forwarded on the host machine.
    * `PORT`: set it to `3000`. We will use this environment variable to configure the port on which the Express server will listen.
    * `API_SECRET_KEY`: set it to a secret string of your choice. This will be used to sign and verify JSON Web Tokens (JWT) for authentication.
5. Open the `compose.yml` file and add the `.env` file to the `database` and `app` services via the `env_file` section. This will load the environment variables from the `.env` file into the containers.
6. Now we'll configure the app to use these environment variables. Environment variables are accessed in Node.js using the `process.env` object.
    1. Open the `package.json` and verify that the `mariadb` package is listed as a dependency. If it is not, install it using `npm install mariadb`.
    2. Open the `server.js` file in the `src` folder and set the `PORT` constant to the value of the `PORT` environment variable, falling back to `3000` if the environment variable is not set.
        ```javascript	
        const PORT = process.env.PORT || 3000;
        ```
    3. Open the `TokenMiddleware.js` file in the `src/api/middleware` folder and set the `API_SECRET` constant to the value of the `API_SECRET_KEY` environment variable.

## Task 2: Creating a Database Connection Module

In this task, you will create a module to manage the connection to the database. This module will be used by the DAOs to interact with the database.

### Steps

1. Create a new file called `DBConnection.js` in the `src/api/db` folder.
2. In this file, import the `mariadb` module into a constant called `mariadb`.
3. Create a global variable called `pool` and set it to `null`. This variable will store the connection pool to the database. A connection pool is a cache of database connections that can be reused, which can improve performance. We can request a connection from the pool when we need to interact with the database and give it back when we are done.
4. Add a function as a named export called `getDatabsaeConnection` with no parameters. In this function you will:
   1. Check if the `pool` variable is `null`. If it is, create a new connection pool using the `mariadb.createPool` function providing the connection parameters from the environment variables in the `.env` file.
        ```javascript
        pool = mariadb.createPool({
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          user: process.env.MYSQL_USER,
          password: process.env.MYSQL_PASSWORD,
          database: process.env.MYSQL_DATABASE,
          charset: process.env.DB_CHARSET
        });
        ```
    2. Return the connection pool.
5. Add a function as a named export called `query` that accepts two parameters: `query` and `params`. The first parameter is required, but the second one is optional and defaults to an empty string. In this function you will:
   1. Call the `getDatabaseConnection` function to get the connection pool, initializing it if necessary. Store the result in a constant called `pool`.
      ```javascript	
      const pool = exports.getDatabaseConnection();
      ```
   2. Return the result of calling the `pool.query` function providing the `query` and `params` variables as arguments. This function returns a promise that resolves to the result of the query, but can fail if there is an error. For debugging purposes, also add a `.catch` block to log any errors to the console and throw the error again.
      ```javascript
      return pool.query(query, params).catch(err => {
        console.log(err);
        throw err;
      });
      ```
6. Add a third function as a named export called `close` that accepts no parameters. In this function you will:
   1. Check if the `pool` variable is set. If it is, call the `pool.end` function to close the connection pool and then set it to `null`.
      ```javascript
      if (pool) {
        pool.end();
        pool = null;
      }
      ```

## Task 3: County DAO from the Database

In this task, you will implement the County DAO to interact with the `county` table in the database.

### Steps

1. Open the `CountyDAO.js` file in the `src/api/db` folder.
2. Import the `DBConnection` module into a constant called `db`.
3. Import the `County` model into a constant called `County`. The DAO will use this model to create instances of `County` to represent the data from the database. Notice thet the frontend uses county fields that are named differently from the database column names. The DAOs and models will handle this abstraction.
4. Find the function called `getCounties`. In this function you will:
   1. Call the `db.query` function and return its value. You will need to provide the SQL query as a parameter to select all the counties from the `county` table. This function returns a promise that resolves with an array of row objects representing the results of the query.
      ```javascript
      return db.query('SELECT * FROM county').then...;
      ```
   2. When the promise resolves, convert each row object into a `County` instance and return an array of these instances.
      ```javascript
      return rows.map(row => new County(row));
      ```
5. Find the function called `getCountyById`. In this function you will:
    1. Call the `db.query` function and return its value. In this case, in addition to the SQL query, you will need to provide the ID of the county. To prevent SQL injection, we will parametrize this query rather than concatenating strings, so the SQL query string will have a `?` character to indicate a placeholder for a parameter and the second parameter to the `query` function will be an array of values, where the position of the value in the array corresponds to the position of the placeholder in the query string. Right now we have only one placeholder, so the array will have only one element.
      ```javascript
      return db.query('SELECT * FROM county WHERE cty_id = ?', [countyId]).then...;
      ``` 
    2. When the promise resolves, we need to check that we actually received a matched row. We can do this by checking the length of the rows array. If we have one record (there should be only one because we are querying by the primary key), convert the first row object into a `County` instance and return it. Otherwise, throw an error indicating that the county was not found.
        ```javascript
        if(rows.length === 1) {
          return new County(rows[0]);
        }
        throw new Error('County not found');
        ```
6. Find the function called `createCounty`. In this function you will:
    1. Call the `db.query` function and return its value. You will need to provide the SQL query as a parameter to insert a new county into the `county` table. This query will have placeholders for the values of the county fields, so you will need to provide an array of values as the second parameter to the `query` function. In this case, we only need to provide the name of the county we want to add, as the ID is generated by the database.
        ```javascript
        return db.query('INSERT INTO county (cty_name) VALUES (?)', [countyName]).then...;
        ```
    2. The promise for operations other than `SELECT` queries will resolve with a result object that contains information about the operation. After the query is executed, check the `affectedRows` property of the result object to determine if the insert was successful. If it was, return the county by calling the `getCountyById` function with the ID of the newly created county. If it was not, throw an error indicating that the county could not be created.
        ```javascript
        if(result.affectedRows === 1) {
          return exports.getCountyById(result.insertId);
        }
        throw new Error('County could not be created');
        ```

## Task 4: Running our NC Parks App

In this task, you will run the NC Parks app using Docker Compose and verify that everything is working properly.

### Steps

1. Open a terminal and navigate to the folder of this activity.
2. Run the Docker Compose stack by executing the following command:
    ```bash
    docker compose up
    ```
3. Inspect the output of the command to verify that the containers are running without errors and that the database container has finished initializing. You will see a message indicating that the database is ready to accept connections.
4. Open your browser and navigate to `http://localhost:3000`. You should see the NC Parks app running and prompting you to log in.
5. Log in with username `student` (or `graduate`) and password `password`.
5. Verify that all functionality is working properly:
    * You can view parks and filter them by county.
    * You can view the details of a park.
    * When you visit a park, the homepage displays the list of parks you have visited.
