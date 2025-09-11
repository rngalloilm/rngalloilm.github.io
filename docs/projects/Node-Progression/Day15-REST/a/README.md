# Activity 15.a: An API for NC Parks

In this activity, you will create a REST API for the North Carolina parks app that serves park and county data as JSON. You will also update the frontend to use this API instead of the mock data.

## Activity Resources

1. [Fetch API on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
2. [Promises on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
3. [Express Router Documentation](https://expressjs.com/en/api.html#router)
4. [REST API Design Tutorial](https://www.restapitutorial.com/)
5. [JavaScript Modules on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
6. Assets
   * [Starter Files](files/)

## Task 1: Setting Up the Folder Structure

In this task, you will initialize the provided Express project by installing the required dependencies and running the provided files.

### Steps

1. Create a new folder in your repository's Scratch Pad under today's folder for this activity.
2. Place the provided files in this new folder.
3. Install the required dependencies by running `npm install` in the terminal on this folder.
7. Start the server and verify that you can access the app at `http://localhost:3000`.

## Task 2: API for NC Parks in a `Router`

In this task, you will implement REST API endpoints for our North Carolina parks that serves the list of parks and counties as JSON.

### Steps

1. Create a new file called `APIRoutes.js` in the `src/api` folder of your project.
2. In this file, create a new Express router object called `router`.
3. Import the county and park DAOs.
4. In this router, create GET routes that follow proper REST API design and rely on the DAOs to return JSON responses for the following endpoints:
    1. Get all counties.
    2. Get a county by ID. If the county is not found, return a 404 status code and an appropriate message as JSON.
    3. Get all parks in a given county. If there is an error (e.g., the county is not found), return a 404 status code and an appropriate message as JSON.
    4. Get all parks.
    5. Get a park by ID. If the park is not found, return a 404 status code and an appropriate message as JSON.
5. Make sure to export the `router` object at the end of the file as the default export.

At this point, the implementation of the API is complete, but it is not yet connected to the server. We will do that in the next task.

## Task 3: Mounting the API Router

In this task, you will mount the API router onto the `/api` path of the Express app.

### Steps

1. Open the `routes.js` file in the `src` folder of your project.
2. Import the `APIRoutes` object from the `APIRoutes.js` file in the `src/api` folder.
3. Mount the `APIRoutes` router onto the `/api` path of the router object in the file.
4. You should now have a complete API for the North Carolina parks that serves the list of parks and counties as JSON. Test the API by making requests to the appropriate endpoints using your browser or a tool like Insomnia.

## Task 4: API Client in the Frontend

The provided files include the mock API for the North Carolina parks app we had in a previous activity, where the data was available directly on the client. In this task, you will replace this mock API client with an actual client that interacts with the NC Parks REST API you created in the previous task.

### Steps

1. Delete the `data.js` file in the `public/js` folder of your project. We will be pulling the data from the NC Parks REST API instead.
2. Open the `APIClient.js` file in the `public/js` folder of your project.
3. Delete or comment out the import for the `parks` and `counties` objects.
4. Delete or comment out the `getParkCountyArray` function.
5. Delete or comment out the bodies of the `getCounties`, `getCountyById`, `getParksByCountyId`, and `getParkById` functions. We will replace these implementations with calls to the NC Parks API.
6. Import the `HTTPClient` object from the `HTTPClient.js` file.
7. Use the `HTTPClient` object to make GET requests to the NC Parks REST API on each of the functions you commented out in the previous steps, and on the appropriate endpoints. Remember that the `HTTPClient` object has a `get` method that returns a promise that resolves with the parsed JSON object from the response. Don't forget to return the promise from each function.
8. Refresh the page in the browser and verify that the app still works as expected. You should now be fetching the data from the NC Parks API instead of using the mock data. You can check that this is the case by looking at the network tab in the developer tools and seeing the requests to the API.