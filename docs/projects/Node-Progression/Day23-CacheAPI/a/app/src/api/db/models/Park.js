module.exports = class Park {
  id = null;
  name = null;
  lat = null;
  lon = null;
  counties = [];

  constructor(data) {
    this.id = data.par_id;
    this.name = data.par_name;
    this.lat = data.par_lat;
    this.lon = data.par_lon;
  }

  addCounty(county) {
    this.counties.push(county);
  }

};