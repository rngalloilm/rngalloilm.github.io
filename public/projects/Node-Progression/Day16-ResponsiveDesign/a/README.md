# Activity 16.a: Media Queries

In this activity, you will add styles to an app to make it mobile-first by hiding a menu drawer by default and showing it when a button is clicked. You will then use media queries to adjust the styles for desktop and print views.


## Activity Resources

1. [CSS Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries)
2. [CSS: Cascading Style Sheets](https://developer.mozilla.org/en-US/docs/Web/CSS) on MDN
3. [CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference) documentation on MDN
4. Assets
   * [Starter Files](files/)


# Task 1: Mobile-first Design

In this task, you will add styles to hide the menu drawer by default and show it when a button is clicked.

## Steps

1. Create a new folder in your repository's Scratch Pad under today's folder for this activity.
2. Place the provided files in this new folder.
3. Open the `menu.html` file in your browser to see the app. You should see two columns: a menu drawer on the left and the main content on the right.
4. Open the browser's developer tools activate device emulation so that you can easily change the size of the viewport to test the responsiveness of the page.
5. Open the `responsive.css` file.
6. Add styles to hide the `nav` element by default. You will want to add styles to:
   1. Set the position to `absolute`.
   2. Set the height to `100%`.
   3. Move the drawer off canvas by setting the `transform` property to `translate(-250px, 0)`. We are moving it off canvas by 250px to the left since this is the width of the drawer.
7. Add styles to the nav when it has the class `open` to show the drawer by translating it back to `0, 0`.
8. Refresh the page and verify that the drawer is hidden by default. Clicking on the hamburger icon should show the drawer. When the drawer is open, clicking on the main content should close the drawer again.


# Task 2: Desktop View

In this task, you will use media queries to adjust the styles for desktop views so that the menu drawer is always open when the screen width is greater than 600px.

## Steps

1. In the `responsive.css` file, add a media query that targets screens with a minimum width of 600px.
2. Inside the media query, you will want to add styles to:
   1. Keep the `nav` open by resetting its position to `relative` and resetting its translation to `0, 0`.
   2. Since the drawer is always open, we don't need the hamburger icon. Set its display to `none`.
3. Optionally, you can add styles to the `main` and `nav` elements to show a message and indicate that the instructions in the page are not applicable when the drawer is always open:
    ```css
    main::after {
      content: 'The drawer stays open (and this is shown) if width > 600px';
    }

    main p,
    nav p {
      text-decoration: line-through;
    }
    ```
4. Refresh the page and verify that the drawer is always open when the screen width is greater than 600px. The behavior should be the same as in the mobile view when the screen width is less than 600px.


# Task 3: Print Styles

In this task, you will add styles that will make the page more printer-friendly by avoiding printing backgrounds and the menu drawer.

## Steps

1. In the `responsive.css` file, add a media query that targets print views.
2. Inside the media query, you will want to add styles to:
   1. Hide the hamburger menu icon by setting its display to `none`.
   2. Change the background color of the `main` element with the class `purple` to white and the text color to black.
   3. Hide the `nav` element by setting its display to `none`.
3. Refresh the page and attempt to print it. The print preview should show a white background with black text and no menu drawer.