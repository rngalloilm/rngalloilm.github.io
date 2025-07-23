# Activity 17.b: Server-side Sessions

In this activity, you will use HTTP cookies to keep track of which parks a user has visited in our NC Parks app.

## Activity Resources

1. [HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies) on MDN
2. [Express Middleware](https://expressjs.com/en/guide/using-middleware.html)
3. [Express Documentation](https://expressjs.com/en/4x/api.html)
3. [`cookie-parser` Middleware](https://github.com/expressjs/cookie-parser)
4. Assets
   * [Starter Files](files/)

## Task 1: Configuring the App to Work With Cookies

In this task, you will initialize the folder structure and install the required dependencies for the provided Express project.

### Steps

1. Create a new folder in your repository's Scratch Pad under today's folder for this activity.
2. Place the provided files in this new folder.
3. On this folder, install the `cookie-parser` middleware by running `npm install cookie-parser`. This will also install all the dependencies required by the app from the `package.json` file.
4. Import the `cookie-parser` middleware in the `server.js` file and attach it to the app.
   ```js
   const cookieParser = require('cookie-parser');
   app.use(cookieParser());
   ```
5. Start the server and verify that you can access the app at `http://localhost:3000`.

## Task 2: Creating Middleware to Establish a Session

In this task, you will create a middleware function that will establish a session in a cookie for every client. The server will keep track of all sessions and session data in memory.

### Steps

1. Create a new file called `SessionCookieMiddleware.js` in a new  `src/middleware` folder in your project.
2. In this file, create a function to generate a random 6-byte session ID in hexadecimal representation using the `crypto` module.
   ```js
   const crypto = require('crypto');

   function generateSessionId() {
     return crypto.randomBytes(6).toString('hex');
   }
   ```
3. Create a constant called `sessions` to store the session data in memory.
   ```js
   const sessions = {};
   ```
4. Create a constant called `SESSION_COOKIE_NAME` to store the name of the cookie that will be used to store the session ID.
   ```js
   const SESSION_COOKIE_NAME = 'NCParks';
   ```
5. Create a function to generate an object that will represent the data associated with each session. We want each session to store an array of visited parks, and a timestamp of when the session was created.
   ```js
   function generateEmptySession() {
     return {
       visitedParks: [],
       createdAt: new Date(),
     };
   }
   ```
6. Now create a middleware function called `SessionCookieMiddleware` and export it as the default export. This function will be responsible for recovering a session from a cookie if it exists, or for establishing a new session if one doesn't exist.
   ```js
   function SessionCookieMiddleware(req, res, next) {
     //Your code here
   }

   module.exports = SessionCookieMiddleware;
   ```
7. In the body of this function, do the following:
   1. If the request doesn't have a cookie with the name we specified in `SESSION_COOKIE_NAME`, then we will:
      1. Generate a new session ID using the `generateSessionId()` function.
      2. Create a new session object with the `generateEmptySession()` function and store this object in the `sessions` object using the session ID as the key.
      3. Set `req.session` to the session object so that middleware that runs after this one can access the session data for this request.
      4. Set a cookie in the response with the `SESSION_COOKIE_NAME` as the name and the session ID as the value. Configure this to be a secure, HTTP-only cookie that expires in 2 minutes. You can look at the [documentation](https://expressjs.com/en/4x/api.html#res.cookie) for the `res.cookie()` method to see how to set these options.
      5. Add a console log to indicate that a new session was created. This is not required, but useful for debugging purposes.
         ```js	
         console.log('We have a new visitor!', sessionId, req.session);
         ```
   2. If the request has a cookie with the name we specified in `SESSION_COOKIE_NAME`, then we will:
      1. Get the session ID from the cookie.
      2. Check that we have a session for this session ID in the `sessions` object. We may not have one if the server was restarted while the cookie is still valid. If there is no session for the session ID in the cookie, we will initialize a new session object and store it in the `sessions` object using the session ID as the key.
      3. Set `req.session` to the session object so that middleware that runs after this one can access the session data for this request.
      4. Add a console log to indicate that the session was recovered. This is not required, but useful for debugging purposes.
         ```js
         console.log('Oh look,', sessionId, 'is back!', req.session);
         ```
   3. Call the `next()` function to pass the request to the next middleware in the stack.
8. Now back in the `server.js` file, import the `SessionCookieMiddleware` function and attach it to the app.
   ```js
   const SessionCookieMiddleware = require('./middleware/SessionCookieMiddleware');
   app.use(SessionCookieMiddleware);
   ```
9. With your server running, you can verify that everything is working properly by:
   1. Refreshing the page and making sure everything is still working as before
   2. Opening the browser's developer tools and checking the cookies for the site. You should see a cookie with the name `NCParks` and a value that is a hexadecimal string. This is the session ID.
   3. You can also check the console logs to see the messages you added in the middleware function. You should see a console log for each request made to the server.

## Task 3: Storing Visited Parks in the Session

In this task, you will keep track of the parks that a user has visited in the session by recording the park ID in the session data every time the user calls the API endpoint to retrieve a park's details.

### Steps

1. In the `APIRoutes.js` file in the `src/api` folder of your project, find the route that handles the request for a park's details. This route should be a `GET` request to `/parks/:parkId`.
2. In this route, if the park requested is found and after sending the park object in the response, add the park ID to the `visitedParks` array in the session object, but only if the park ID is not already in the array.
   ```js
   if (!req.session.visitedParks.includes(parkId)) {
     req.session.visitedParks.push(parkId);
   }
   ```
3. With your server running, you can verify that everything is working properly by:
   1. Visiting the home page and selecting a park to view its details, then coming back to the homepage. You should see a list of each park detail page you have visited.
   2. You can check the console logs on the backend to see that the session object now contains the IDs of the parks you have visited.