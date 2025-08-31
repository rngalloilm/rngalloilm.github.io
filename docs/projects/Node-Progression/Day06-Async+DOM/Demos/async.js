console.clear();

// SYNC

// function fetchSync(URL) {
//     let result;
//     console.log('1. Open connection to ' + URL);
//     console.log('2. Send request');
//     console.log('3. Receive and parse response');
//     result = {body: "It works!", status: 200};
//     return result;
// }

// console.log('Work before request');
// console.log('Response', fetchSync('https://ncsu.edu'));
// console.log('Work after request');

// ASYNC 1
// Returns undefined before the timer is done and then after 5 seconds we get the result.

// function fetchAsync(URL) {
//     let result;
//     setTimeout(() => {
//         console.log('Async 1.1. Open connection to ' + URL);
//         console.log('Async 1.2. Send request');
//         console.log('Async 1.3. Receive and parse response');
//         result = {body: "It works!", status: 200};
//     }, 5000);

//     return result;
// }

// console.log('Work before request');
// console.log('Response', fetchAsync('https://ncsu.edu'));
// console.log('Work after request');



// ASYNC 2 (WITH CALLBACK)
// 

// function fetchAsync2(URL, callback) {
//     let result;
//     setTimeout(() => {
//         console.log('Async 2.1. Open connection to ' + URL);
//         console.log('Async 2.2. Send request');
//         console.log('Async 2.3. Receive and parse response');
//         result = {body: "Async 2 It works!", status: 200};
//         callback(result);
//     }, 5000);

//     return result;
// }

// function onResult(result) {
//     console.log("Async 2 result received", result);
// }

// console.log('Async 2 Work before request');
// console.log('Async 2 Response', fetchAsync2('https://ncsu.edu', onResult));
// console.log('Async 2 Work after request');


