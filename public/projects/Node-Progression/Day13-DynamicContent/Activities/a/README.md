# Activity 13.a: Client-Side Rendered Parks App

In this activity, you will complete the implementation of a client-side rendered app

## Activity Resources

1. [`<template>` Element on MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)
2. [Location on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Location)
3. [URLSearchParams on MDN](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
4. [Promises on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
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

## Task 2: Populating the County Dropdown

In this task, you will use the provided mock API client to populate the county dropdown in the home page.

### Steps

1. Open the `index.html` file in the `templates` folder.
2. At the end of the page (after the footer, before the closing body tag), add a new HTML template for the county dropdown options.
    ```html
    <template id="countyOptionTemplate">
      <option value=""></option>
    </template>
    ```
3. Open the `home.js` file in the `public/js` folder. You will see some starter code, including an import statement for the mock API client and a reference to the counties dropdown called `countiesSelect`.
4. Find the comments for Task 2 to identify where to add your code for this task.
5. Add a new constant called `countyOptionTemplate` that references the `countyOptionTemplate` `<template>` element.
    ```js	
    const countyOptionTemplate = document.getElementById('countyOptionTemplate');
    ```
6. Use the mock API client to get the list of counties. Remember that the mock API client has a `getCounties` method that returns a promise that resolves with the list of counties.
7. When this promise resolves, iterate over the list of counties and create an `option` element for each county using the `countyOptionTemplate`. Each county in the array will be of the following form:
    ```js
    {
      id: 93,
      name: "Wake"
    }
    ```
8. For each county, do the following:
   1. Instantiate the `countyOptionTemplate` content and get a reference to the `option` element.
      ```js	
      const countyOptionInstance = countyOptionTemplate.content.cloneNode(true);
      const countyOption = countyOptionInstance.querySelector('option');
      ```
    2. Set the `value` attribute of the `option` element to the county name and the `textContent` to the county name as well.
        ```js	
        countyOption.value = county.id;
        countyOption.textContent = county.name;
        ```
    3. Append the `option` element to the `countiesSelect` dropdown.
        ```js
        countiesSelect.appendChild(countyOption);
        ```
9. After iterating, but before the `then` block ends, call the provided `updateParks()` function to populate the parks list with all the parks in the system when the page first loads.
10. Refresh the page in the browser and verify that the county dropdown is populated with the counties from the mock API.

## Task 3: Displaying Parks for a Selected County

In this task, you will implement the functionality to display the parks for the selected county in the parks list.

### Steps

1. Open the `index.html` file in the `templates` folder.
2. At the end of the page (after the footer, before the closing body tag), add a new HTML template for each park item.
    ```html
    <template id="parkTemplate">
      <a class="park" href="/park?id=">
        <h2></h2>
        <img src="/img/park.jpg">
        <div class="counties-list">Spans Counties:</div>
      </a>
    </template>
    ```
3. Each park will display a list of counties it spans. Create a new template for each county chip.
    ```html
    <template id="countyChipTemplate">
      <span class="county"></span>
    </template>
    ```
4. Open the `home.js` file in the `public/js` folder.
5. Find the comments for Task 3 to identify where to add your code for this task.
6. Add a new constant called `parkTemplate` that references the `parkTemplate` `<template>` element.
    ```js	
    const parkTemplate = document.querySelector('#parkTemplate');
    ```
7. Add a new constant called `countyChipTemplate` that references the `countyChipTemplate` `<template>` element.
    ```js
    const countyChipTemplate = document.querySelector('#countyChipTemplate');
    ```
8. Create a function called `createParkHTML` that takes a park object as parameter. The park object will have the following structure:
    ```js
    {
      id: 219,
      name: "Falls Lake State Recreation Area",
      lat: 36.0117,
      lon: -78.6888,
      county: [
          93,
          32
      ],
      counties: [
        {
          id: 93,
          name: "Wake"
        },
        {
          id: 32,
          name: "Durham"
        }
      ]
    }
    ```
9. In the body of the `createParkHTML` function, do the following:
   1. Clone the `parkTemplate` content and get a reference to the `park` element.
      ```js	
      const parkInstance = parkTemplate.content.cloneNode(true);
      const parkElement = parkInstance.querySelector('.park');
      ```
   2. Set the `href` attribute of the park element to link to the park's detail page: `/park?id=` followed by the park ID.
      ```js
      parkElement.href = '/park?id=' + park.id;
      ```
   3. Get a reference of the `h2` element and set the `textContent` to the park name.
      ```js
      const parkName = parkElement.querySelector('h2');
      parkName.textContent = park.name;
      ```
   4. Iterate over the park's `counties` array. For each county, do the following:
      1. Clone the `countyChipTemplate` content and get a reference to the `county` element.
         ```js
         const countyInstance = countyChipTemplate.content.cloneNode(true);
         const countyElement = countyInstance.querySelector('.county');
         ```
      2. Set the `textContent` of the `county` element to the county name.
      3. Append the county element to the park element.
   5. Make `createParkHTML` return the park element.
10. Refresh the page in the browser and verify that the parks list is populated with the parks from the mock API. You should be able to change the selected county and see an updated list of parks.

## Task 4: Rendering the Park Detail Page

In this task, you will implement the functionality to render the park detail page. This page will receive the park ID as a query parameter.

### Steps

1. Open the `park.html` file in the `templates` folder to see the structure of the park detail page. Notice that we have a couple of places where we want to display the park name (`class="park-name"`), and a container for the list of counties (`id="counties"`).
2. At the end of the page (after the footer, before the closing body tag), add a new HTML template for each county chip.
    ```html
    <template id="countyChipTemplate">
      <span class="county"></span>
    <template>
    ```
3. Open the `park.js` file in the `public/js` folder. You will see some starter code, including an import statement for the mock API client and a function to initialize an embedded map.
4. Find the comments for Task 4 to identify where to add your code for this task.
5. Retrieve the park ID from the query parameters.
    ```js	
    const query = window.location.search;
    let parameters = new URLSearchParams(query);
    const id = parameters.get('id');
    ```
6. Use the mock API client to get the park details for the given park ID. Remember that the mock API client has a `getParkById` method that returns a promise that resolves with the corresponding park object, or rejects if the provided id does not match any existing park.
7. When this promise resolves, call the provided `initMap` function to initialize the embedded map with the park's latitude and longitude.
    ```js	
    initMap(park.lat, park.lon);
    ```
8. Change the page's title to include the name of the current park.
    ```js
    document.title = 'North Carolina Parks - ' + park.name;
    ```
9. For every element in the page where we want to display the park's name, set the `textContent` to the park's name.
    ```js
    document.querySelectorAll('.park-name').forEach(element => {
      element.textContent = park.name;
    });
    ```
10. Get a reference to the `counties` container element.
    ```js
    const countiesList = document.querySelector('#counties');
    ```
11. Add a new constant called `countyChipTemplate` that references the `countyChipTemplate` `<template>` element.
    ```js	
    const countyChipTemplate = document.getElementById('countyChipTemplate');
    ```
12. Iterate over the park's `counties` array. For each county, do the following:
    1. Clone the `countyChipTemplate` content and get a reference to the `county` element.
       ```js
       const countyInstance = countyChipTemplate.content.cloneNode(true);
       const countyElement = countyInstance.querySelector('.county');
       ```
    2. Set the `textContent` of the `county` element to the county name.
    3. Append the county element to the `countiesList` container.
13. When the promise returned by the mock API rejects, redirect the user to the error page.
    ```js
    document.location = "/error";
    ```
14. Refresh the page in the browser and verify that the park detail page is rendered correctly. You should see the park's name, the list of counties it spans, and the map centered on the geographical location of the park.