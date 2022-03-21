class Accounts {
  constructor(auth) {
    this.api = auth.authApi;
    this.localId = auth.localId;
  }

  async getAll() {
    let url = "/accounts";

    const response = await this.api.get(url);

    console.log(response);

    // if (!response.ok) throw response.originalError;
    if (!response.ok) console.log("we got a fuckin error");

    //return true;
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

    const response = await this.api.get(`/accounts/${id}`);
    if (!response.ok) throw response.originalError;

    return response.data;
  }
}

module.exports = Accounts;
