/**
 * Providers grants access to Hatchfi's provider data
 */
class Providers {
  constructor(api) {
    if (api.authApi) {
      this.api = api.authApi;
    } else {
      this.api = api;
    }
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

    try {
      const response = await this.api.get(`/providers/${name}`);
      return response.data;
    } catch (error) {
      return { error: "That provider doesn't exist" };
    }
  }
}

module.exports = Providers;
