class API {
  constructor(config) {
    this.config = { ...config };
  }

  init() {
    return this;
  }
}

module.exports = API;
