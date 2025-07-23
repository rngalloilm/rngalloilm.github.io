# Activity 19.a: Authentication with JSON Web Tokens

In this activity, you will implement token-based authentication in our NC Parks app. The idea is similar to the session-based authentication we implemented previously, but now our server can remain stateless. 

## Activity Resources

1. [HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies) on MDN
2. [Express Middleware](https://expressjs.com/en/guide/using-middleware.html)
3. [Express Documentation](https://expressjs.com/en/4x/api.html)
4. [`pbkdf2` Documentation](https://nodejs.org/api/crypto.html#cryptopbkdf2password-salt-iterations-keylen-digest-callback) in the `crypto` module of Node.js
5. [`jsonwebtoken` Library Documentation](https://github.com/auth0/node-jsonwebtoken)
6. [JWT.io](https://jwt.io/)
7. Assets
   * [Starter Files](files/)

## Task 1: Setting Up the Folder Structure

In this task, you will initialize the provided Express project by installing the required dependencies and running the provided files.

### Steps

1. Create a new folder in your repository's Scratch Pad under today's folder for this activity.
2. Place the provided files in this new folder.
3. Install the `jsonwebtoken` library by running `npm install jsonwebtoken` in the terminal on this folder. This will also install all the dependencies required by the app from the `package.json` file.
4. Start the server and verify that you can access the app at `http://localhost:3000`.

## Task 2: Logging Users In

In this task, you will verify the user's credentials with the UserDAO and, if they are correct, create a JSON Web Token for the user and set it in a cookie in the response.

### Steps

1. Open the `TokenMiddleware.js` file in the `src/middleware` folder of your project and at the top of the file, require the `jsonwebtoken` library.
    ```js
    const jwt = require('jsonwebtoken');
    ```
2. Create a constant near the top called `API_SECRET` with a random string as a value. In a real application, this would never be hard-coded. Instead, it would be stored securely so that it can remain private.
3. Find the `generateToken` function exported in this file. This function will receive three parameters: the request object, the response object, and a user object. We will use this function to create a token for the user when they log in by doing the following:
   1. Create an object called `payload` with the claims we want to store for this token. We will want to store the user on a private claim called `user` and an expiration time of 1 hour in the `exp` registered claim. The expiration time should be a Unix timestamp in seconds. We can get the current time in milliseconds by calling `Date.now()`.
   2. Create a constant called `token` and set it to the JWT generated using the `jwt.sign` function with the `payload` object as payload and `API_SECRET` as the token secret.
   3. Set a cookie in the response with the name in the `TOKEN_COOKIE_NAME` constant and the token as value. Configure this cookie to be secure, HTTP-only, and to expire in 2 minutes.
2. Now in the `APIRoutes.js` file in the `src/api` folder of your project, find the route that handles the login request. This route should be a `POST` request to `/users/login`. In this route you will:
   1. If the body of the request has a username and password fields, call the `getUserByCredentials` function from the `UserDAO` with these fields as parameters. Remember that this function returns a promise. Otherwise, if the username or password are not provided respond with a 400 error: `res.status(400).json({error: 'Credentials not provided'})`.
   2. If the promise from the UserDAO resolves, call the `generateToken` function from the `TokenMiddleware` with the request, response, and user objects as parameters. This will initialize the session and set the cookie in the response with the session ID.
   3. Respond to the request with the user object as JSON.
      ```js
      res.json({user: user});
      ```
   4. If the promise rejects, respond to the request with the error message and status code from the rejection, if any, or 500.
      ```js
      res.status(error.code || 500).json({error: error.message});
      ```
3. If everything works as expected, you will be able to log in with username `student` (or `graduate`) and password `password` and be redirected to the home page. You can check this works properly by opening the browser's developer tools and checking the cookies for the site. You should see a cookie with the name `NCParksToken` and a value that is the JWT. You can copy this JWT and validate it in [jwt.io](https://jwt.io/) by providing the API secret as the secret key. You may see 501 errors ("Not Implemented") in the console, but this is expected because there is functionality we haven't implemented yet.


## Task 3: Authorization Middleware to Protect Routes Behind Authentication

In this task, you will create a middleware function that will limit access to most endpoints to users who are logged in. This middleware will check the user's token, retrieve the user from the token, and populate it in the request for other middleware to use. The token can be sent in a cookie or in the `Authorization` header.

### Steps

1. Open the `TokenMiddleware.js` file in the `src/middleware` folder of your project and find the `TokenMiddleware` middleware function. In this function you will do the following:
   1. Declare a variable called `token` and set it to `null`.
   2. Check if the request has a cookie with the name specified in the `TOKEN_COOKIE_NAME` constant. If this cookie is set, retieve the token from this cookie.
      ```js
      if(req.cookies[TOKEN_COOKIE_NAME]) { //We do have a cookie with a token
        token = req.cookies[TOKEN_COOKIE_NAME]; //Get token from cookie
      }
      ```
  2. If we don't have this cookie, check to see if we have the token in the `Authorization` header. If the header is set, retrieve the token from the header. The value of the header will be in the format `Bearer <token>`, so we have to check this too.
      ```js
      else { //No cookie, so let's check Authorization header
        const authHeader = req.get('Authorization');
          if(authHeader && authHeader.startsWith("Bearer ")) {
          //Format should be "Bearer token" but we only need the token
          token = authHeader.split(" ")[1].trim();
        }
      }
      ```
  3. If we were unable to retrieve a token at this point (`token` is still null) respond with a 401 error (`res.status(401).json({error: 'Not Authenticated'});`) and return early.
  4. If we do have a token, we need to verify it using the `jwt.verify` function to make sure it's a valid JWT, it's not expired, and it hasn't been tampered with. This function will return the payload of the token if it is valid, or throw an error if it is not. We will wrap this in a try-catch block to handle the error.
      ```js
      try {
        const payload = jwt.verify(token, API_SECRET);
        req.user = payload.user;
        next();
      } catch(error) {
        res.status(401).json({error: 'Not Authenticated'});
      }
      ```
2. Now open the `APIRoutes.js` file in the `src/api` folder of your project and add the `TokenMiddleware` middleware to all routes we want to protect behind authentication. That will be every route in the API except for logging in or out.
3. Find the route that handles the request to retrieve the authenticated user's details. This route should be a `GET` request to `/users/current`. In this route, respond to the request with the user object from the session.
  ```js
  res.json(req.user);
  ```
4. If everything works as expected, you will be able to log in with username `student` (or `graduate`) and password `password`, be redirected to the home page, and see your username in the header. You should now see fewer 501 errors in the console, but you may still see some because there is functionality we haven't implemented yet. Now that we don't have server-side sessions, we can restart our server and still be logged in, as long as the cookie and the JWT are not expired.


## Task 4: Allowing Users to Log Out

In this task, you will create a route that will log out the user. This will involve deleting cookie by setting a new expired cookie with the same name in the response.

### Steps

1. Open the `TokenMiddleware.js` file in the `src/middleware` folder of your project and find the `removeToken` function. This function will receive the request object and the response object as parameters. We will use this function to remove the cookie with the token for the user when they log out.
2. Set an expired cookie in the response with the name in the `TOKEN_COOKIE_NAME` constant and an empty string as value. Configure this cookie to be secure, HTTP-only, and to expire in a date in the past (a negative number of seconds). This will tell the browser that the cookie is expired and should be removed.
3. Now in the `APIRoutes.js` file in the `src/api` folder of your project, find the route that handles the logout request. This route should be a `POST` request to `/users/logout`. In this route you will:
  1. Call the `removeToken` function already imported from `TokenMiddleware.js` with the request and response as parameters.
  2. Respond to the request with a JSON object that indicates success.
      ```js
      res.json({success: true});
      ```
4. If everything works as expected, you will be able to log out in the app. You can check this works properly by opening the browser's developer tools and checking the cookies for the site. You should no longer see a cookie with the name `NCParksToken` after logging out.


## Bonus Task 5: Recording and Displaying Visited Parks

Now that our server is stateless, there is no session to store users' visited parks anymore. Instead, we are going to use the `UserDAO` to store this information in our mock database. In this task, you will add new DAO methods to store and retrieve the visited parks for a user, and you will use this functionality in API endpoints.

### Steps

1. Open the `UserDAO.js` file in the `src/dao` folder of your project and add the following methods to the `UserDAO` class:
   1. A method called `recordVisitedPark` that receives a user ID and a park ID as parameters. This function should return a promise. In the body of this promise you will:
      1. Retrieve the user object from the mock database using the user ID.
      2. If the user is not found, reject the promise with a 404 error and return early.
          ```js
          if(!user) {
            reject({code: 404, message: "No such user"});
            return;
          }
          ```
      2. Add the park ID to the `visitedParks` array of the user object, if the park is not already in the array.
          ```js
          if(!user.visitedParks.includes(parkId)) {
            user.visitedParks.push(parkId);
          }
          ```
      3. Resolve the promise with a sanitized user object.
   2. A method called `getUserVisitedParks` that receives a user ID as parameter. This function should return a promise. In the body of this promise you will:
      1. Retrieve the user object from the mock database using the user ID.
      2. If the user is not found, reject the promise with a 404 error and return early.
          ```js
          if(!user) {
            reject({code: 404, message: "No such user"});
            return;
          }
          ```
      2. Resolve the promise with the `visitedParks` array of the user object
2. Now in the `APIRoutes.js` file in the `src/api` folder of your project, find the route that handles the request for a park's details. This route should be a `GET` request to `/parks/:parkId`. In this route you will:
   1. Find the `catch` block that handles the error when the park is not found. After returning an error response, throw the error again to propagate it to the next `catch` block.
      ```js
      throw err;
      ```
   2. Extend the existing promise chain by adding a new `then` block after the `catch` block. In this block you will call the `recordVisitedPark` method from the `UserDAO` with the user ID from the request and the park ID from the route parameters and return it. This will run after the park details are sent in the response, but only if the park is found.
   3. Add a `catch` block to handle any errors from the `recordVisitedPark` method or in case the park doesn't exist. If an error occurs, log the error to the console.
3. Now find the route that handles the request to retrieve the authenticated user's list of visited parks. This route should be a `GET` request to `/users/current/parks`. In this route you will call the `getUserVisitedParks` method from the `UserDAO` with the user ID from the request. This will return a promise with a list of IDs of the user's visited parks, but we want to return the full park objects for each of these IDs. You can do this as follows:
    ```js
    UserDAO.getUserVisitedParks(req.user.id).then(async visitedParksIds => {
      const visitedParks = [];
      for(const parkId of visitedParksIds) {
        const park = await ParkDAO.getParkById(parkId);
        visitedParks.push(park);
      }
      res.json(visitedParks);
    }).catch(err => {
      res.status(err.code || 500).json({error: err.message});
    });
    ```
4. If everything works as expected, you will be able to visit a park and see it in the list of visited parks in the home page when the user is logged in. Since we are not storing this information in the session anymore, you will see the list of visited parks even if the user logs out and then logs back in (as long as the server is not restarted, since we are still using a mock database).