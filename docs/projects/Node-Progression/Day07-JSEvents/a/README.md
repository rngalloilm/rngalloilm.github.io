# Activity 07.a: Basic Dark Mode Toggle

In this activity, you will practice event handling and manipulating styles via JavaScript.

## Activity Resources

1. [Event reference](https://developer.mozilla.org/en-US/docs/Web/Events) on MDN
2. [CSS `invert()` function](https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/invert()) on MDN
3. Assets
   * [Starter Files](files/)

## Task: Toggle Dark Mode

You are given an HTML page with a checkbox that you must use to toggle dark mode on the page. You will do this by listening for the `change` event on the checkbox and toggling styles on the `html` element to invert the colors of the page.

### Steps

1. Create a new folder in your repository's Scratch Pad under today's folder for this activity.
2. Download the starter files from the resources above and place them in the new folder.
3. Create a new JavaScript file called `script.js` and link it to the HTML file, making sure that it runs after the DOM is fully loaded.
4. Create a constant called `darkModeToggle` that references the `input` element with the `id="darkModeToggle"`.
5. Add an event listener to the `darkModeToggle` that listens for the `change` event and calls a function called `toggleDarkMode`.
6. Implement the `toggleDarkMode` function to toggle dark mode on the page by using the CSS `filter: invert(1)` property on the `html` element. You have several options to do this:
   a. You can add/remove a class to the `html` element to toggle the dark mode. For this, you will need to create a CSS class called `invert` that inverts the colors of the page. You will then attach/remove this class to the `html` element via JavaScript.
   b. You can directly set the `filter` property on the `html` element via JavaScript. You can do this by setting the `style` property of the `html` element.
7. Open the `index.html` file in your browser and verify that the dark mode is toggled on the page when the checkbox is checked. You will want to open the browser's developer tools to debug as you develop.
   