class Accounts {
  constructor(api) {
    this.api = api;
  }

  async getAll(local_id) {
    let url = "/accounts";
    const query = getQueryString(params);
    if (query) url = `${url}?${query}`;

    const response = await this.api.get(url);
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

module.exports = Accounts;
