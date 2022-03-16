const API = require("./api");

class Hatchfi {
  init(config = {}) {
    const api = new API(config);

    return api.init();
  }
}

module.exports = new Hatchfi();
