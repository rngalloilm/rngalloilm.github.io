# Activity 18.a: User Authentication and Sessions

In this activity, you will implement session-based user authentication in our NC Parks application.

## Activity Resources

1. [HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies) on MDN
2. [Express Middleware](https://expressjs.com/en/guide/using-middleware.html)
3. [Express Documentation](https://expressjs.com/en/4x/api.html)
4. [`pbkdf2` Documentation](https://nodejs.org/api/crypto.html#cryptopbkdf2password-salt-iterations-keylen-digest-callback) in the `crypto` module of Node.js
5. Assets
   * [Starter Files](files/)

## Task 1: Setting Up the Folder Structure

In this task, you will initialize the provided Express project by installing the required dependencies and running the provided files.

### Steps

1. Create a new folder in your repository's Scratch Pad under today's folder for this activity.
2. Place the provided files in this new folder.
3. Install the required dependencies by running `npm install` in the terminal on this folder.
4. Start the server and verify that you can access the app at `http://localhost:3000`.


## Task 2: Getting a User Object from Username and Password

In this task, you will create a function in the `UserDAO` that will return a sanitized user object if the provided username and password match an existing user.

### Steps

1. In the `UserDAO.js` file in the `src/api/db` folder of your project, find the function called `getUserByCredentials`. This function receives a username and password and should return a promise that resolves with the corresponding user object if the credentials match an existing user.
2. Make sure this function is returning a new promise.
3. In the body of the promise, create a constant called `user` and set it to the user object from the `users` object (already available in that file) that matches the provided username.
    ```js	
    const user = Object.values(users).find(user => user.username == username);
    ```
   Each user object in this collection will have the following structure:
    ```js
    {
      id: 1,
      first_name: "Stu",
      last_name: "Dent",
      username: "student",
      avatar: "https://robohash.org/veniamdoloresenim.png?size=64x64&set=set1",
      salt: "48c8947f69c054a5caa934674ce8881d02bb18fb59d5a63eeaddff735b0e9",
      password: "83d9bdb5e20f3571b087db9aabf190a296741c3e864d7742f35658cfccc1b79c4599aad25084aa9a28c649a50c92244227b3e53e197621301d619d1ea01873c4"
    }
    ```
4. If the user is not found, reject the promise with an error message and return early.
    ```js
    reject({code: 401, message: "No such user"});
    ```
5. If the user is found, use the `pbkdf2` function from the `crypto` module to hash the provided password with the user's salt and compare the result with the user's hashed password. This function will accept the following parameters in this order:
   * The password to hash
   * The salt to use
   * The number of iterations the hash will be performed. Set this to `100000`.
   * The length of the key you want generated. Set this to `64`.
   * The digest (hasing) algorithm to use. Set this to `'sha512'`.
   * A callback function that will receive two parameters. Call these `err` and `derivedkey`. If the operation is successful, `err` will be `null` and `derivedkey` will be the hashed password. Otherwise, `err` will contain an error object.
6. In the body of the callback from the previous step, do the following:
   1. Check if there was an error. If there was, reject the promise with an error message and return early.
      ```js
      if (err) { //problem computing digest, like hash function not available
        reject({code: 500, message: "Error hashing password " + err});
        return;
      }
      ```
   2. Create a constant to store a string representation of the hash in hexadecimal format.
      ```js
      const digest = derivedKey.toString('hex');
      ```
   3. Compare this hash with the user's stored hashed password. If they match, resolve the promise with a filtered user object. We want to make sure we don't expose private fields like the salt and hashed password. You can use the provided `getFilteredUser` function to create a sanitized version of the user object with only the public fields. If the hashes do not match, reject the promise with an error message: `{code: 401, message: "Invalid password"}`.

## Task 3: Logging Users In

In this task, you will verify the user's credentials with the UserDAO and, if they are correct, initialize a session for the user and set a cookie in the response with the session ID.

### Steps

1. In the backend:
   1. Open the `CookieAuthMiddleware.js` file in the `src/middleware` folder of your project and find the `initializeSession` function. This function will receive three parameters: the request object, the response object, and a user object. We will use this function to initialize a session for the user when they log in by doing the following:
      1. Create a constant called `sessionId` and set it to a random 64-byte hex string.
          ```js
          const sessionId = crypto.randomBytes(64).toString('hex');
          ```
      2. Create a new `SessionData` object with the data we want to store in this session: the user, an array of visited parks, and the timestamp of when the session was created.
          ```js
          const sessionData = {
            user: user,
            visitedParks: [],
            createdAt: new Date(),
          };
          ```
      3. Store this session data in the `sessions` object using the `sessionId` as the key.
      4. Set a cookie in the response with the name in the `SESSION_COOKIE_NAME` constant and the value of the `sessionId`. Configure this cookie to be secure, HTTP-only, and to expire in 2 minutes.
   2. Now in the `APIRoutes.js` file in the `src/api` folder of your project, find the route that handles the login request. This route should be a `POST` request to `/users/login`. In this route you will:
      1. If the body of the request has a username and password fields, call the `getUserByCredentials` function from the `UserDAO` with these fields as parameters. Remember that this function returns a promise. Otherwise, if the username or password are not provided respond with a 400 error: `res.status(400).json({error: 'Credentials not provided'})`.
      2. If the promise from the UserDAO resolves, call the `initializeSession` function from the `CookieAuthMiddleware` with the request, response, and user objects as parameters. This will initialize the session and set the cookie in the response with the session ID.
      3. Respond to the request with the user object as JSON.
          ```js
          res.json({user: user});
          ```
      4. If the promise rejects, respond to the request with the error message and status code from the rejection.
          ```js
          res.status(error.code).json({error: error.message});
          ```
2. In the frontend:
   1. Open the `APIClient.js` file in the `static/js` folder of your project and find the `logIn` function. This function will receive a username and password and will make a POST request to the `/users/login` endpoint with these credentials:
      ```js	
      const data = {
        username: username,
        password: password
      };
      return HTTPClient.post(`${BASE_API_PATH}/users/login`, data);
      ```
   2. Now open the `login.js` file in the `static/js` folder of your project and find the listener for the `submit` event of the login form. In this function, after the provided code, you will:
      1. Call the `logIn` function from the `APIClient` with the username and password from the form fields. This function returns a promise.
      2. If the promise resolves, redirect the user to the home page.
          ```js
          document.location = './';
          ```
      3. If the promise rejects, call the provided `showError` function with the error message from the rejection.
3. If everything works as expected, you will be able to log in with username `student` and password `password` and be redirected to the home page. You can check this works properly by opening the browser's developer tools and checking the cookies for the site. You should see a cookie with the name `NCParks` and a value that is a hexadecimal string. This is the session ID.
   

## Task 4: Allowing Users to Log Out

In this task, you will create a route that will remove the session for the user when they log out. This will involve deleting the session from the `sessions` object and setting an expired cookie in the response.

### Steps

1. In the backend:
   1. Open the `CookieAuthMiddleware.js` file in the `src/middleware` folder of your project and find the `removeSession` function. This function will receive the request object and the response object as parameters. We will use this function to remove a session for the user when they log out by doing the following:
      1. Create a constant called `sessionId` and set it to the session ID from the cookie with the name in the `SESSION_COOKIE_NAME` constant.
      2. If there is a session ID in the cookie, delete the session from the `sessions` object.
          ```js
          delete sessions[sessionId];
          ```
      3. Set an expired cookie in the response with the name in the `SESSION_COOKIE_NAME` constant and an empty string as value. Configure this cookie to be secure, HTTP-only, and to expire in a date in the past (a negative number of seconds). This will tell the browser that the cookie is expired and should be removed.
   2. Now in the `APIRoutes.js` file in the `src/api` folder of your project, find the route that handles the logout request. This route should be a `POST` request to `/users/logout`. In this route you will:
      1. Call the `removeSession` function already imported from `CookieAuthMiddleware.js` with the request and response as parameters.
      2. Respond to the request with a JSON object that indicates success.
          ```js
          res.json({success: true});
          ```
2. In the frontend:
   1. Open the `APIClient.js` file in the `static/js` folder of your project and find the `logOut` function. This function will make a POST request to the `/users/logout` endpoint, but it doesn't need to send any data:
      ```js
      return HTTPClient.post(`${BASE_API_PATH}/users/logout`, {});
      ```
   2. Now open the `auth.js` file in the `static/js` folder of your project and find the `logOut` function. In this function you will:
      1. Call the `logOut` function from the `APIClient`. This function returns a promise.
      2. If the promise resolves, redirect the user to the home page.
          ```js
          document.location = './login';
          ```

We are going to use this functionality in the next task.


## Task 5: Authorization Middleware to Protect Routes Behind Authentication

In this task, you will create a middleware function that will limit access to most endpoints to users who are logged in. This middleware will check the user's session and populate it in the request for other middleware to use. You will also add functionality for the frontend to be able to retrieve the user that's logged in.

### Steps

1. In the backend:
   1. Open the `CookieAuthMiddleware.js` file in the `src/middleware` folder of your project and find the `CookieAuthMiddleware` middleware function. In this function you will do the following:
      1. Check if the request has a cookie with the name specified in the `SESSION_COOKIE_NAME` constant. If it doesn't, respond with a 401 error and return early.
          ```js
          if (!req.cookies[SESSION_COOKIE_NAME]) {
            res.status(401).json({error: 'Not Authenticated'});
            return;
          }
          ```
      2. If we do have a session cookie, retrieve the session ID from the cookie.
      3. Check if we have a session for this session ID. If we don't, it means there's a cookie without a valid session. Remove the session with the `removeSession` function and respond with a 401 error (`res.status(401).json({error: 'Not Authenticated'});`) and return.
      4. If we do have a session, store the corresponding session data in the `req.session` object so that other middleware can access it and call the `next()` function.

   2. Now open the `APIRoutes.js` file in the `src/api` folder of your project and add the `CookieAuthMiddleware` middleware to all routes we want to protect behind authentication. That will be every route in the API except for logging in or out.
   3. Find the route that handles the request to retrieve the authenticated user's details. This route should be a `GET` request to `/users/current`. In this route, respond to the request with the user object from the session.
      ```js
      res.json(req.session.user);
      ```
2. In the frontend:
   1. Open the `APIClient.js` file in the `static/js` folder of your project and find the `getCurrentUser` function. This function will make a GET request to the `/users/current` endpoint:
      ```js
      return HTTPClient.get(`${BASE_API_PATH}/users/current`);
      ```
   2. Now open the `auth.js` file in the `static/js` folder of your project. We want to always retrieve the current user when the page loads, so at the end of the file, do the following:
      1. Call the `getCurrentUser` function from the `APIClient`. This function returns a promise that resolves with the current user's object.
      2. If the promise resolves, call the provided `displayUserInHeader` function with the user object as parameter.
      3. If the promise rejects, check the status property of the error object. If it's 401, redirect the user to the login page. You can also print the error to the console for debugging purposes.
          ```js
          console.log(`${error.status}`, error);
          if (error.status == 401) {
            document.location = './login';
          }
          ```
3. If everything works as expected, you will be able to log in with username `student` and password `password`, be redirected to the home page, and see your username in the header. You can check this works properly by opening the browser's developer tools and checking the cookies for the site. You should see a cookie with the name `NCParks` and a value that is a hexadecimal string. This is the session ID. You should be able to log out and the visited parks should also be recorded.
