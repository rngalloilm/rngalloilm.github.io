# Activity 06.a: Promise-based Network Mock API

In this activity, you will create a method the mocks a network request using a promise-based API. You will then consume this method to print the data to the console.

## Activity Resources

1. [Implementing a promise-based API](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Implementing_a_promise-based_API) on MDN
2. [setTimeout()](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout) documentation on MDN
3. [Promise() constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/Promise) documentation on MDN
4. Assets
   * [JavaScript Starter](files/fetchMock.js)

## Task: Create a Promise-based `fetch` Method

You are given a JavaScript file with a function that mocks a network request using `setTimeout()` and uses a callback to return the data after a delay. Your task is to create a similar function, called `fetch(URL)`, that returns a promise that resolves with the data after this same delay. You should use the content of the callback version as a reference.

* There should be no `console.log()` inside your `fetch(URL)` function.

### Steps

1. Create a new folder in your repository's Scratch Pad under today's folder for this activity.
2. Download the JavaScript starter file from the resources above and place it in the new folder.
3. Create a new `fetch(URL)` function that return a promise that resolves with the data after a delay. Use the content of the callback version as a reference.
4. Replace the call to `fetchWithCallback('https://ncsu.edu', onResult)` with a call to your `fetch(URL)` function and consume the promise to print the data to the console.
5. Run the script from a terminal using `$ node fetchMock.js` to verify that the data is printed to the console. You should see an output that looks like this:

```
1. Work before request
2. Work after request
3. Fetch Result { body: 'fetch of https://ncsu.edu', status: 200 }
```

### Bonus

If you have time, add validation to your `fetch(URL)` function to reject the promise if the URL is not a string or is empty.
