const db = require('./DBConnection');
const County = require('./models/County');

module.exports = {
  getCounties: () => {
    return db.query('SELECT * FROM county').then(rows => {
      return rows.map((row) => new County(row));
    });
  },

  getCountyById: (countyId) => {
    return db.query('SELECT * FROM county WHERE cty_id=?', [countyId]).then(rows => {
      if(rows.length === 1) {
        return new County(rows[0]);
      }
      throw new Error('County not found');
    });
  },

  createCounty: (countyName) => {
    return db.query('INSERT INTO county (cty_name) VALUES (?)', [countyName]).then((result) => {
      if(result.affectedRows === 1) {
        return exports.getCountyById(result.insertId);
      }
      throw new Error('County could not be created');
    });
  },
};
