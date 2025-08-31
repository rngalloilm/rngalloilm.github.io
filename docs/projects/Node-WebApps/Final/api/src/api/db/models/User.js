const crypto = require('crypto');

module.exports = class User {
  id = null;
  firstName = null;
  lastName = null;
  username = null;
  avatar = null;
  balance = null;
  #passwordHash = null;
  #salt = null;

  constructor(data) {
    this.id = data.usr_id || data.id;
    this.firstName = data.usr_first_name || data.firstName;
    this.lastName = data.usr_last_name || data.lastName;
    this.username = data.usr_username || data.username;
    this.avatar = data.usr_avatar || data.avatar;
    this.balance = data.usr_balance || data.balance;
    this.#salt = data.usr_salt || data.salt;
    this.#passwordHash = data.usr_password || data.password;
  }

  // Static method to hash a new password
  static hashPassword(password) {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16).toString('hex'); // Generate a random salt
      crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
        if (err) {
          reject("Error hashing password: " + err);
        } else {
          resolve({
            salt: salt,
            hash: derivedKey.toString('hex')
          });
        }
      });
    });
  }

  validatePassword(password) {
    return new Promise((resolve, reject) => {
      // Use the user's stored salt
      crypto.pbkdf2(password, this.#salt, 100000, 64, 'sha512', (err, derivedKey) => {
        if (err) {
          return reject("Error validating password: " + err);
        }

        const digest = derivedKey.toString('hex');
        if (this.#passwordHash === digest) {
          resolve(this);
        } else {
          reject("Invalid username or password");
        }
      });
    });
  }

  toJSON() {
    // Make sure sensitive data isn't sent back unless explicitly needed
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      avatar: this.avatar,
      balance: this.balance
    };
  }
};