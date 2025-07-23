const db = require('./DBConnection');
const User = require('./models/User');

module.exports = {
  getUserByCredentials: (username, password) => {
    return db.query('SELECT * FROM user WHERE usr_username=?', [username]).then(rows => {
      if (rows.length === 1) { // we found our user
        const user = new User(rows[0]);
        return user.validatePassword(password);
      }
      // if no user with provided username
      throw new Error("No such user");
    });

  },

  recordVisitedPark: (userId, parkId) => {
    return db.query('INSERT INTO user_visit (uvs_par_id, uvs_usr_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE uvs_par_id=uvs_par_id',
        [parkId, userId]).then(result => {
      return result.affectedRows > 0;
    });
  },

  getUserVisitedParks: (userId) => {
    return db.query('SELECT uvs_par_id FROM user_visit WHERE uvs_usr_id = ?', [userId]).then(rows => {
      return rows.map(row => row.uvs_par_id);
    });
  }
};
