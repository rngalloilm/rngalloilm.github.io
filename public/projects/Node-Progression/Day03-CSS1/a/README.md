# Activity 03.a: External, Internal, and Inline CSS

In this activity, you will explore different ways to apply CSS styles to an HTML document. You will use external, internal, and inline CSS to style the content of an HTML page.

## Activity Resources

1. [How CSS is structured](https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps/How_CSS_is_structured) documentation on MDN
2. Assets
   * [HTML Starter](files/index.html)

## Task: Apply CSS Styles

You are given an HTML file that contains three instances of the same structure. For each instance, you will apply CSS styles using external, internal, and inline CSS, respectively, to achieve a result that looks like this:

![Result](files/result.png)

You will need to apply CSS styles to the appropriate instances in the appropriate way (external, internal, or inline) in a way that only affects the intended instance. For this, you will need to come up with the appropriate CSS selectors. Then, use the following CSS rules in the respective selectors.  

#### `<div>` Container

```css
background-color: rgba(8, 117, 8, 0.1); /*Use the appropriate color for each instance*/
border: 1px solid rgb(8, 117, 8); /*Use the appropriate color for each instance*/
padding: 10px;
margin: 20px 15px;
border-radius: 10px;
font-family: Arial, Helvetica, sans-serif;
box-shadow: 5px 5px 5px gray;
```

#### `<h1>` Heading
  
```css
font-variant: small-caps;
margin: 0 0 10px 0;
display: inline-block;
border-bottom: 3px dashed rgb(8, 117, 8); /*Use the appropriate color for each instance*/
```

#### `<p>` Content

```css
font-style: italic;
margin-bottom: auto;
```

#### `<code>` Block inside the `<p>`

```css
font-family: monospace;
font-style: normal;
font-weight: bold;
```

#### Colors to use

Instance | Background Color          | Dark Color
-------- | ------------------------- | -------------------
External | `rgba(49, 106, 230, 0.1)` | `rgb(49, 106, 230)`
Internal | `rgba(8, 117, 8, 0.1)`    | `rgb(8, 117, 8)`
Inline   | `rgba(219, 42, 42, 0.1)`  | `rgb(219, 42, 42)`


### Steps

1. Create a new folder in your repository's Scratch Pad under today's folder for this activity.
2. Download the HTML starter file from the resources above and place it in the new folder.
3. Create an external CSS file called `styles.css` next to the HTML file and link it to the HTML file.
4. Add CSS rulesets to the external CSS file to style the first instance with `id="external"`. Make sure styles defined there only apply to this instance and not the others.
5. Add internal CSS rulesets to the HTML file to style the second instance with `id="internal"`. Make sure styles defined there only apply to this instance and not the others.
6. Add inline CSS styles to the HTML elements to style the third instance with `id="inline"`. Make sure styles defined there only apply to this instance and not the others.