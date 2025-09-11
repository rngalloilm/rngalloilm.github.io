# Activity 07.b: A Restrictive Input

In this activity, you will practice event handling on the browser to prevent the default behavior of the event.

## Activity Resources

1. [Event reference](https://developer.mozilla.org/en-US/docs/Web/Events) on MDN
2. [Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) on MDN
3. [`keydown` event](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event) on MDN
4. Assets
   * [Starter Files](files/)

## Task: Restrict Input on a Text Field

You are given an HTML page with a text field that you must you will create a text field that only allows the user to input capital letters. You will do this by listening for the `keydown` event on the text field and preventing the default behavior if the key pressed is not valid (anything other than a capital letter).

### Steps

1. Create a new folder in your repository's Scratch Pad under today's folder for this activity.
2. Download the starter files from the resources above and place them in the new folder.
3. Create a new JavaScript file called `script.js` and link it to the HTML file, making sure that it runs after the DOM is fully loaded.
4. Create a constant called `inputField` that references the `input` element.
5. Add an event listener to the `inputField` that listens for the `keydown` event and calls a function called `restrictInput`.
6. Implement the `restrictInput` function to disallow input if it is not a capital letter. You can use this regular expression to test if the key pressed is a capital letter: `/^[A-Z]$/` (Hint: look at the documentation of the `keydown` event to identify the property you need to determine the key that was pressed).
7. Open the `index.html` file in your browser and verify that the text field is restricting input appropriately. You will want to open the browser's developer tools to debug as you develop.