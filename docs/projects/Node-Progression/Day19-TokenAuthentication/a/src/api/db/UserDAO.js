const crypto = require('crypto');

let users = require('./data/users.json');


function getFilteredUser(user) {
  return {
    "id": user.id,
    "first_name": user.first_name,
    "last_name": user.last_name,
    "username": user.username,
    "avatar": user.avatar
  }
}


//This file mimics making asynchronous request to a database
module.exports = {
  getUserByCredentials: (username, password) => {
    return new Promise((resolve, reject) => {
      const user = Object.values(users).find(user => user.username == username);
      if(!user) {
        reject({code: 401, message: "No such user"});
        return;
      }
      //We have a user with that username
      
      crypto.pbkdf2(password, user.salt, 100000, 64, 'sha512', (err, derivedKey) => {
        if (err) { //problem computing digest, like hash function not available
          reject({code: 500, message: "Error hashing password " + err});
          return;
        }

        const digest = derivedKey.toString('hex');
        if (user.password == digest) {
          resolve(getFilteredUser(user));
        }
        else {
          reject({code: 401, message: "Invalid password"});
        }
      });
        
    });

  },
};
