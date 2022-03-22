class Accounts {
  constructor(auth) {
    this.api = auth.authApi;
    this.localId = auth.localId;
  }

  async getAll() {
    let url = "/accounts";

    try {
      const response = await this.api.get(url);
      return response.data;
    } catch (error) {
      return error;
    }
  }

  /**
   *
   * @param {*} name - the short name of the provider, eg: ethereum or bsc
   * @returns a provider object
   */
  async getOne(id) {
    let url = `/accounts/${id}`;

    try {
      const response = await this.api.get(url);
      return response.data;
    } catch (error) {
      return error;
    }
  }

  // Need to add deleteOne and deleteAll
}

module.exports = Accounts;
