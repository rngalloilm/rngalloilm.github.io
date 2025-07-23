const db = require('./DBConnection');
const Park = require('./models/Park');
const County = require('./models/County');

module.exports = {
  getParks: () => {
    return db.query('SELECT * FROM park JOIN park_county ON pct_par_id=par_id JOIN county ON pct_cty_id=cty_id').then(rows => {
      let currentPark = null;
      const parks = [];

      rows.forEach(parkData => {
        if(!currentPark) {
          currentPark = new Park(parkData);
          currentPark.addCounty(new County(parkData));
          parks.push(currentPark);
        }
        else if(currentPark.id !== parkData.par_id) {
          currentPark = new Park(parkData);
          currentPark.addCounty(new County(parkData));
          parks.push(currentPark);
        }
        else {
          currentPark.addCounty(new County(parkData));
        }
      });
      return parks;
    });
  },

  getParksByCountyId: (countyId) => {
    return db.query('SELECT * FROM park JOIN park_county ON pct_par_id=par_id JOIN county ON pct_cty_id=cty_id WHERE pct_cty_id=?', [countyId]).then(rows => {
      let currentPark = null;
      const parks = [];

      rows.forEach(parkData => {
        if(!currentPark) {
          currentPark = new Park(parkData);
          currentPark.addCounty(new County(parkData));
          parks.push(currentPark);
        }
        else if(currentPark.id !== parkData.par_id) {
          currentPark = new Park(parkData);
          currentPark.addCounty(new County(parkData));
          parks.push(currentPark);
        }
        else {
          currentPark.addCounty(new County(parkData));
        }
      });
      return parks;
    });
  },

  getParkById: (parkId) => {
    return db.query('SELECT * FROM park JOIN park_county ON pct_par_id=par_id JOIN county ON pct_cty_id=cty_id WHERE par_id=?', [parkId]).then(rows => {
      if(rows.length === 0) { // No rows returned means no park found
        throw new Error('Park not found');
      }

      let park = null;
      rows.forEach(parkData => {
        if(!park) {
          park = new Park(parkData);
          park.addCounty(new County(parkData));
        }
        else {
          park.addCounty(new County(parkData));
        }
      });
      return park;
    });
  },

  createPark: (parkData) => {
    return db.query('INSERT INTO park (par_name, par_lat, par_lon) VALUES (?, ?, ?)',
        [parkData.name, parkData.lat, parkData.lon]).then(result => {
      if(result.affectedRows === 1) {
        return getParkById(result.insertId);
      }
      throw new Error('Park could not be created');
    });
  },

  addParkToCounty: (parkId, countyId) => {
    return db.query('INSERT INTO park_county (pct_par_id, pct_cty_id) VALUES (?, ?)',
     [parkId, countyId]).then(result => {
      return result.affectedRows > 0;
    });
  },

};
