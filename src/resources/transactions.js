class Transactions {
  constructor(api) {
    this.api = api.api;
  }

  async getAll() {
    const response = await this.api.get("/providers");
    if (!response.ok) throw response.originalError;

    return response.data;
  }

  /**
   *
   * @param {*} name - the short name of the provider, eg: ethereum or bsc
   * @returns a provider object
   */
  async getOne(name) {
    if (!id || typeof id !== "string") {
      throw new Error("Please provide a valid Hatchfi provider id.");
    }

    const response = await this.api.get(`/providers/${id}`);
    if (!response.ok) throw response.originalError;

    return response.data;
  }
}

module.exports = Transactions;
