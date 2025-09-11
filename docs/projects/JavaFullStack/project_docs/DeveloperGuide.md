How to set up, test, and run WolfCafe

## IMPORT WOLFCAFE INTO ECLIPSE 
Start by creating a new workspace on Eclipse. Clone this repository into your new workspace by adding a local repository in the Git Repositories view.
Navigate to the working set in the Git Repositories view.
Right-click and select "Import Projects," ensuring only the frontend and backend are selected. Do not worry about the file containing the entire project.
Let the workspace build.

## INSTALL LOMBOK
Lombok is a library that lets us use annotations to automatically generate getters, setters, and constructors. For Lombok to work in Eclipse (and other IDEs like IntelliJ or VS Code), you need to set up Lombok with the IDE in addition to including it in the pom.xml file.
Follow the instructions for setting up Lombok in Eclipse, available on the official Lombok website. Make sure you download the latest version of Lombok from the Maven Repository as a JAR file.

## CONFIGURATION
Update application.properties in src/main/resources/ and src/test/resources/.
Set spring.datasource.password to your local MySQL password.
Set app.jwt-secret as described below.
Set app.admin-user-password to a plain text string that you will use as the admin password.

## SET app.jwt-secret
Create a secret key for JWT authentication. Think of a secret key phrase, and encrypt it using SHA256 encryption. You can use an online tool to generate the encrypted text. Copy the encrypted text into your application.properties file.

## ADMIN ROLE AND SECRET USE
The config.SetupDataLoader initializes the database with roles and creates a default user with the ADMIN role. This class runs automatically when the application starts.
The admin user has the username "admin" and the email address "admin@admin.edu". The password for the admin user is specified in the application.properties file. The password is encrypted using the password encoder.

## UPDATE PROJECT
In the File Explorer view, navigate to the pom.xml file. Right-click and select "Maven > Update Project."
Let the workspace build.

## RUN THE BACKEND
Navigate to wolf-cafe-backend in your file explorer. Right-click and select "Run As > Java Application." Startup and run status will appear in the console.

## INSTALL FRONTEND LIBRARIES
Change the directory to the wolf-cafe-frontend folder in your Git repository.
In the terminal, run the following command:
npm install
This will create the node_modules directory in your project and install the dependencies listed in the package.json file. Errors on the node_modules folder are acceptable.

## RUN THE FRONTEND
In the terminal, run the following command:
npm run dev
This will start the frontend.

## VIEW IN BROWSER
Enter http://localhost:3000 in your browser. You should see your WolfCafe application running. To stop the frontend, select the terminal and press Ctrl/Cmd+C.

## RUN UNIT TESTS
You can run all tests at once by right-clicking on the src/test/java folder and selecting "Run As > JUnit." Alternatively, run tests by package by selecting each package and choosing "Run As > JUnit Test."
If tests fail unexpectedly, drop your database (e.g., using MySQL Workbench) and rerun.

## REST API INFORMATION
Refer to the Endpoints

## TESTING USER AUTHENTICATION IN POSTMAN
To add new user roles, edit wolf-cafe-backend/src/main/.../config/Roles.java to add to the enumeration.
The following examples show how to work with user authentication in Postman:

## Create a New User
Endpoint: POST http://localhost:8080/api/auth/register
Body:
{
    "name": "Nick Gallo",
    "username": "rgallo",
    "email": "rgallo@ncsu.edu",
    "password": "gallo"
}

Response: 201 Created
User registered successfully.

Login with User
Endpoint: POST http://localhost:8080/api/auth/login
Body:
{
    "usernameOrEmail": "rgallo",
    "password": "gallo"
}

Response: 200 OK
{
    "accessToken": "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJzaGVja21hbiIsImlhdCI6MTcyOTEyNjg1MiwiZXhwIjoxNzI5NzMxNjUyfQ.WiPROZAMhNbiB8H3fhNJdiC-XX5RJEcHXzmGPEH7aMEFvsjbsvk2m1ZcAKi-lTdt",
    "tokenType": "Bearer",
    "role": "ROLE_CUSTOMER"
}
Note: The accessToken will vary with each login. Save this for testing endpoints requiring authentication.

Get Items
Roles: STAFF, CUSTOMER
Authorization:
Bearer
Token (copy from the response of an authenticated user)

Response: 200 OK

