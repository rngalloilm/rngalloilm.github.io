# Activity 03.b: Custom Button

In this activity, you will use CSS to style HTML elements to mimic as closely as possible the appearance (and some behavior) of the native `<button>` HTML element.

## Activity Resources

1. [CSS: Cascading Style Sheets](https://developer.mozilla.org/en-US/docs/Web/CSS) on MDN
2. [CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference) documentation on MDN
3. [&lt;button&gt; HTML Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) documentation on MDN
4. [PickXColor](https://pickxcolor.com/) screen eyedropper tool
5. Assets
   * [HTML Starter](files/index.html)
   * [CSS Starter](files/styles.css)


## Task: Create a Custom Button

Your task is to identify appropriate CSS selectors and write CSS rules to mimic the appearance and behavior of native HTML buttons.

You are given an HTML file that contains 3 native HTML buttons and the necessary HTML markup for 3 instances of your custom button. Several instances of each are present and arranged in a grid for you to compare your custom buttons with the native ones in terms of sizing, behavior, and overall presentation. You will add your styles externally on the provided `styles.css` file. There is no need to modify the HTML file at all.

You will need to provide the appropriate selectors and CSS rules to style the custom buttons in all states (normal, when the mouse is over them, when the user clicks on them, and when the button is foused with the keyboard). You do not need to style the native buttons at all.


### Steps


1. Create a new folder in your repository's Scratch Pad under today's folder for this activity.
2. Download the starter files from the resources above and place it in the new folder.
3. Add CSS rulesets to `styles.css` to make the custom buttons look and behave like native ones as much as you can.
4. Open the `index.html` file in your browser to compare the appearance and behavior of your custom buttons with that of the native HTML buttons displayed on the page.
5. Find the differences between the custom buttons and the native buttons and use the [CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference) documentation to identify the appropriate CSS properties and values to use.
6. Modify the CSS rules in `styles.css` as needed to make the custom buttons look and behave as closely as possible to the native buttons. You can use [PickXColor](https://pickxcolor.com/) to get the exact color values from the native buttons. Use the [CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference) documentation to identify the appropriate CSS properties and values to use.
7. You will need to refresh the page every time you make a change to the CSS file for these changes to take effect.



## Bonus

If you finish early, implement the disabled state for the custom buttons. First, add a new pair of buttons: a native one and a custom one to compare their appearance. Then, add the disabled property to both buttons and use CSS attribute selectors to target custom buttons that are disabled via this attribute (because the `:disabled` pseudo-class will not apply to our custom button).