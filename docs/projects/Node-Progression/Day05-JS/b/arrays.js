const array1 = [1, 2, 3, 4, 5];

// TASK 1: Functional Array Iteration
// Iterates over the array and prints the index and value for each element.
function printArray(arr) {
  arr.forEach((value, index) => {
    console.log(`Pos: ${index}, Val: ${value}`);
  });
}

// printArray(array1);

// TASK 2: Operating on Array Elements
// Creates a new array with the square of each value from the original array.
const squareArray = (arr) => arr.map(value => value ** 2);

// console.log(squareArray(array1));

// TASK 3: Filtering Array Elements
// Creates a new array containing only the even values from the original array.
// array.filter((element, index, array) => { condition });
function filterArray(arr) {
  return arr.filter(value => value % 2 === 0);
}

//console.log(filterArray(array1));

// TASK 4: Reducing Arrays
// Calculates the sum of all values in the array.
// array.reduce((accumulator, currentValue, currentIndex, array) => { logic here }, initialValue);
const sumArray = (arr) => arr.reduce((sum, value) => sum + value, 0);

//console.log(sumArray(array1));

// TASK 5: Chaining Array Methods
// Filters even values, squares them, and calculates the sum of the squared values.
function chainArray(arr) {
  return arr
    .filter(value => value % 2 === 0)
    .map(value => value ** 2)
    .reduce((sum, value) => sum + value, 0);
}

//console.log(chainArray(array1));
