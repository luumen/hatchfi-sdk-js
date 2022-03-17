class Providers {
  constructor(api) {
    this.api = api;
  }

  /**
   *
   * @returns an array of provider objects
   */
  async getAll() {
    //console.log(await this.api.get("/providers"));
    const response = await this.api.get("/providers");
    //if (!response.ok) throw response.originalError;
    return response.data;
  }

  /**
   *
   * @param {*} name - the short name of the provider, eg: ethereum or bsc
   * @returns a provider object
   */
  async getOne(name) {
    if (!name || typeof name !== "string") {
      throw new Error("Please provide a valid Hatchfi provider name.");
    }

    const response = await this.api.get(`/providers/${name}`);
    //if (!response.ok) throw response.originalError;

    return response.data;
  }
}

module.exports = Providers;
