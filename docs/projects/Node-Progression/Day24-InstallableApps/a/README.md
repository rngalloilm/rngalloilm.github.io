# Activity 24.a: An Installable NC Parks App

In this activity, you will update the NC Parks app to make it installable as a Progressive Web App (PWA). You will update the app's theme to match the NC Parks branding, add a favicon, create a web app manifest, and test the app's installability.

## Activity Resources

1. [Web App Manifests](https://developer.mozilla.org/en-US/docs/Web/Manifest) on MDN
2. [Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps) on MDN
3. [`theme-color`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name/theme-color) on MDN
4. [Installing and Uninstalling Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing) on MDN
5. Assets
   * [Starter Files](files/)

## Task 1: Setting Up the Folder Structure

In this task, you will initialize the folder structure for this activity and populate necessary environment variables.

### Steps

1. Create a new folder in your repository's Scratch Pad under today's folder for this activity.
2. Place the provided files in this new folder.
3. Create a file called `.env` and populate it with the contents of the provided `.env.example` file. Fill in the values for the environment variables as needed.
4. Open a terminal and navigate to the folder of this activity.
5. Run the Docker Compose stack by executing the following command:
    ```bash
    docker compose up
    ```
6. Inspect the output of the command to verify that the containers are running without errors and that the database container has finished initializing. You will see a message indicating that the database is ready to accept connections.
7. Open your browser and navigate to `http://localhost:3000`. You should see the NC Parks app running and prompting you to log in.

## Task 2: Theming the App

In this task, you will update the app's theme to match the NC Parks branding and incorporate a favicon.

### Steps

1. In all the HTML files, you will add the following in the `<head>` section:
    1. Add a `<link>` tag with the `rel` attribute set to `icon` and the `href` attribute set to the path of the provided favicon file.
    2. Add a `<meta>` tag with the `name` attribute set to `theme-color` and the `content` attribute set to the primary color of the NC Parks branding. You can use `#252831` as the theme color, or any other one you'd like to try.
    3. Add iOS/Apple-specific `<link>` tags with the `rel` attribute set to `apple-touch-icon`, one for each of the dimentsions provided: 192x192, 256x256, 384x384, and 512x512. The `href` attribute should be set to the relative URL of the provided icon files. Remember to specify the `sizes` attribute for each `<link>` tag.
2. Test your app in the browser to verify that the favicon and theme color are applied correctly. You should see the favicon populated in the browser tab.

## Task 3: Making the App Installable

In this task, you will make the app installable by adding a web app manifest.

### Steps

1. Create a new file called `manifest.webmanifest` in the `static` folder of the app.
2. Populate the manifest file with the following properties:
    1. The full name of the app: `"North Carolina Parks"`.
    2. A short name for the app: `"NC Parks"`.
    3. The start URL of the app: `"/"`.
    4. The display mode of the app: `"standalone"`.
    5. The background color of the app: `"#f3f3f3"`.
    6. The theme color of the app: `"#252831"`.
    7. The scope of the app: `"/"`.
    8. The icons for the app, one for each of the dimensions provided: 192x192, 256x256, 384x384, and 512x512. The `src` attribute should be set to the URL of the provided icon files. Remember to specify the `sizes` attribute for each icon. Since all of these are PNG files, you can set the `type` attribute to `"image/png"`.
3. In all the non-error HTML files (all except the error and offline pages), you will add the following in the `<head>` section:
    1. Add a `<link>` tag with the `rel` attribute set to `manifest` and the `href` attribute set to the URL of the manifest file.

## Task 4: Installing the App

In this task, you will test the app's installability by installing it on your device.

### Steps

1. Open your browser and navigate to `http://localhost:3000`.
2. Click on the browser's menu and look for an option to install the app. This option is usually found in the browser's menu under "Install App" or "Install NC Parks". Some browsers may also display an icon in the address bar to indicate that an app can be installed.
3. Click on the install option and follow the prompts to install the app.
4. Once the app is installed, open it from your device's home screen and verify that it opens in standalone mode without the browser's UI elements.
5. Navigate to a few parks in the app to verify that the app is working as expected.
6. Close the app and stop your Docker Compose stack to simulate being offline.
7. Open the app again and verify that you can still access it. You should be able to see the parks you visited before. Visiting new parks should display the offline screen.