# Activity 06.b: Populate Howls from Array

In this activity, you will create HTML content programmatically via JavaScript.

## Activity Resources

1. [createElement()](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement) documentation on MDN
2. [appendChild()](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild) documentation on MDN
3. Assets
   * [Starter files](files/)

## Task: Create HTML Content via JavaScript

We are starting off with the Howler page from Day 4, but without any howls. Instead, we have the content of these howls in an array in the provided JavaScript file. Your task is to populate the Howler page with these howls programmatically via JavaScript. You will do this by using the `createElement()` and `appendChild()` methods from the browser's DOM API to construct an HTML structure that looks like this for each howl:

```html
<div class="howl container">
  <div class="user">@user3</div>
  <div class="content">Yet another howl to showcase the feed layout.</div>
  <div class="actions">
    <a href="#">Reply</a>
    <a href="#">Rehowl</a>
    <a href="#">Like</a>
  </div>
</div>
```

Here, the values for `user` and `content` will be taken from the array of howls. You will not need to modify the HTML or CSS files for this activity.

### Steps

1. Create a new folder in your repository's Scratch Pad under today's folder for this activity.
2. Download the starter files from the resources above and place them in the new folder.
3. Link the JavaScript file to the HTML file, making sure that it runs after the DOM is fully loaded.
4. Create a constant called `howlContainer` that references the `div` element with the `id="howl-list"`.
5. Iterate over the `howls` array and, for each item, create a new `div` element and its content (as shown above) with the class `howl container` and append it to the `howlContainer`. Once you create elements that need content, you can use the `textContent` property to set the content.
6. Open the `index.html` file in your browser and verify that the howls are displayed as expected. You will want to open the browser's developer tools to debug as you develop.