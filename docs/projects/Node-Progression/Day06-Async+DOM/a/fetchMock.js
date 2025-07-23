console.clear();

/**
 * DO NOT MODIFY THIS FUNCTION 
 */
function fetchWithCallback(URL, callback) {
  let result;
  setTimeout(() => {
      result = {body: `fetchWithCallback of ${URL}`, status: 200};
      callback(result);
  }, 5000);
  return true;
}

function onResult(result) {
  console.log("3. Fetch Result", result);
}

// New function
function fetch(URL) {
  return new Promise((resolve, reject) => {
    let result;
    setTimeout(() => {
        result = {body: `fetchWithCallback of ${URL}`, status: 200};
        resolve(result);
    }, 5000);
    return true;
  });
  
}

// Test
console.log('1. Work before request');

fetch('https://ncsu.edu').then(onResult); // Append .catch to deal with rejections

console.log('2. Work after request');

/*
 * Expected output:
 * 1. Work before request
 * 2. Work after request
 * 3. Fetch Result { body: `fetch of ${URL}`, status: 200 }
 */