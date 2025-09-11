# Activity 17.a: Web Storage API

In this activity, you will use the Web Storage API to store and recover user preferences in a our NC Parks app. 

## Activity Resources

1. [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
2. Assets
   * [Starter Files](files/)

## Task 1: Setting Up the Folder Structure

In this task, you will initialize the provided Express project by installing the required dependencies and running the provided files.

### Steps

1. Create a new folder in your repository's Scratch Pad under today's folder for this activity.
2. Place the provided files in this new folder.
3. Install the required dependencies by running `npm install` in the terminal on this folder.
4. Start the server and verify that you can access the app at `http://localhost:3000`.

## Task 2: Store County Selection in `localStorage`

In this task, you will make the county selection in the home page persistent by storing and retrieving this selection in `localStorage`.

### Steps

1. In the `home.js` file in the `static/js` folder of your project, create a constant called `SELECTED_COUNTY_KEY` and set it to a string value that will be used as the key to store the selected county in `localStorage`.
2. When a county is selected in the dropdown, store the id of the selected county in `localStorage` using the constant you created in the previous step as key. You can use the browser's developer tools to verify that the county is being stored in `localStorage` under the correct key.
3. When the page loads, get the selected county from `localStorage` and store it in a constant called `storageCounty`.
4. When the county dropdown is populated, set the county with the id stored in `storageCounty` as the selected county, if any. You can do this by setting the `selected` attribute of the option element with the stored id to `true`.
5. Refresh the page and verify that the last selected county is being recovered and set as the selected county in the dropdown. The list of parks should also be filtered by the selected county when you refresh.

## Task 3: Preserving Dark Mode Selection

In this task, you will save the user's dark mode preference in `localStorage` and apply it when pages load, including when the user navigates to a different page.

### Steps

1. In the `common.js` file in the `static/js` folder of your project, create a constant called `DARK_MODE_KEY` and set it to a string value that will be used as the key to store whether dark mode is enabled in `localStorage`.
2. When the dark mode toggle is changed, store `1` or `0`, depending on the state of the toggle, in `localStorage` using the constant you created in the previous step as key. You can use the browser's developer tools to verify that the dark mode state is being stored in `localStorage` under the correct key.
3. When the page loads, get the dark mode state from `localStorage`. If the state is `1`, enable dark mode and set the toggle to checked.
4. Refresh the page and verify that the dark mode state is being recovered and applied when the page loads. The dark mode preference should also be preserved when you navigate to a different page, such as a park detail page or back to the homepage.
