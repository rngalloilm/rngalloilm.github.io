const db = require('./DBConnection');
const User = require('./models/User');

module.exports = {
  getUserByCredentials: (username, password) => {
    return db.query('SELECT * FROM user WHERE usr_username=?', [username])
      .then(rows => {
        if (!rows || rows.length === 0) {
          throw new Error("Invalid username or password");
        }
        const user = new User(rows[0]);
        return user.validatePassword(password);
      })
      .catch(err => {
        console.error("Error in getUserByCredentials:", err.message);
        throw new Error("Invalid username or password");
      });
  },

  getUserByUsername: (username) => {
    return db.query('SELECT * FROM user WHERE usr_username=?', [username]).then(rows => {
       if (rows.length === 1) {
        const user = new User(rows[0]);
        return user;
       }
       return null; // No user found
    }).catch(err => {
        console.error("Error in getUserByUsername:", err);
        throw new Error("Database error checking username.");
    });
  },

  // Function to create a new user
  createUser: (firstName, lastName, username, salt, hashedPassword) => {
    const defaultAvatar = null;
    const defaultBalance = 0.00;

    return db.query(
      'INSERT INTO user (usr_first_name, usr_last_name, usr_username, usr_salt, usr_password, usr_avatar, usr_balance) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [firstName, lastName, username, salt, hashedPassword, defaultAvatar, defaultBalance]
    ).then(result => {
      if (!result || result.insertId == null) {
        throw new Error("Failed to create user, insertId not returned.");
      }
      return { id: Number(result.insertId), username, firstName, lastName };
    }).catch(err => {
        if (err.code === 'ER_DUP_ENTRY') {
            console.warn(`Attempted to register duplicate username: ${username}`);
            throw new Error("Username already exists.");
        }
        console.error("Error in createUser:", err);
        throw new Error("Failed to register user due to a database error.");
    });
  },

  getMonthlySpending: async (username) => {
    const user = await module.exports.getUserByUsername(username);
    if (!user) {
      throw new Error("User not found");
    }
    return db.query(
      'SELECT SUM(tra_amount) FROM transaction WHERE tra_usr_id=? AND tra_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND tra_type =?',
      [user.id, 'expense'])
      .then(rows => {
        if (rows.length === 1) {
          const totalSpending = rows[0]['SUM(tra_amount)'] || 0;
          return totalSpending;
        }
        return 0; // No transactions found
    }).catch(err => {
        console.error("Error in getting monthly spending:", err);
        throw new Error("Cannot retrieve monthly spending.");
    });
  },

  getFreeCash: async (username) => {
    const user = await module.exports.getUserByUsername(username);
    if (!user) {
      throw new Error("User not found");
    }
    const totalSpending = await module.exports.getMonthlySpending(username);
    return db.query(
      'SELECT SUM(tra_amount) FROM transaction WHERE tra_usr_id=? AND tra_date >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) AND tra_type =?', 
      [user.id, 'income'])
      .then(rows => {
        if (rows.length === 1) {
          const totalIncome = rows[0]['SUM(tra_amount)'] || 0;
          const freecash = totalIncome - totalSpending;
          return freecash;
        }
      })
      .catch(err => {
        console.error("Error in getting free cash:", err);
        throw new Error("Cannot retrieve free cash.");
      });
  }

};
