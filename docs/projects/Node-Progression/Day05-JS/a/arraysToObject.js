const keys = ['firstName', 'lastName', 'email', 'isStudent'];

const values = [
  ['Stuart', 'Dent', 'student@ncsu.edu', true],
  ['Grace', 'Duate', 'graduate@ncsu.edu', false],
  ['Facundo', 'Ulty', 'faculty@ncsu.edu', false],
];

// Write code to convert the above arrays into an array of objects
const objs = [];

for (const val of values) {
  const obj = new Map();
  keys.forEach((key, index) => {
    obj.set(key, val[index]);
  });
  objs.push(Object.fromEntries(obj));
}

// Print the array of objects to the console
console.log(objs);

/* Expected output:
[
  {
    firstName: 'Stuart',
    lastName: 'Dent',
    email: 'student@ncsu.edu',
    isStudent: true
  },
  {
    firstName: 'Grace',
    lastName: 'Duate',
    email: 'graduate@ncsu.edu',
    isStudent: false
  },
  {
    firstName: 'Facundo',
    lastName: 'Ulty',
    email: 'faculty@ncsu.edu',
    isStudent: false
  }
]
*/
