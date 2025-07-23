module.exports = class County {
  id = null;
  name = null;

  constructor(data) {
    this.id = data.cty_id;
    this.name = data.cty_name;
  }

};