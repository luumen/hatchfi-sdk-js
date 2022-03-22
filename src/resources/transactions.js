class Transactions {
  constructor(api) {
    this.api = api.api;
  }

  /**
   *
   *
   * @returns an array of transaction objects
   */
  async getAll() {
    let url = "/transactions";

    try {
      const response = await this.api.get(url);
      return response.data;
    } catch (error) {
      return error;
    }
  }

  /**
   *
   * @param {*} id - the short name of the provider, eg: ethereum or bsc
   * @returns a provider object
   */
  async getAccount(id) {
    if (!id || typeof id !== "string") {
      throw new Error("Please provide a valid Hatchfi provider id.");
    }

    const response = await this.api.get(`/providers/${id}`);
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
