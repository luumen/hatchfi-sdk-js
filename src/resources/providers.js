/**
 * Providers grants access to Hatchfi's provider data
 */
class Providers {
  constructor(api) {
    this.api = api;
  }

  /**
   *
   * @returns an array of provider objects
   */
  async getAll() {
    const response = await this.api.get("/providers");
    return response.data;
  }

  /**
   *
   * @param {string} name - the short name of the provider, eg: ethereum or bsc
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
