class Accounts {
  constructor(auth) {
    this.api = auth.authApi;
    this.userId = auth.userId;
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
   * @param {*} accountId - the accounts id
   * @returns an account object
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

  /**
   *
   * @param {*} accountId - the accounts id
   * @returns a success message
   */
  async sync(id) {
    let url = `/accounts/${id}/sync`;

    try {
      const response = await this.api.get(url);
      return response.data;
    } catch (error) {
      return error;
    }
  }

  /**
   *
   * @returns a status message
   */
  async deleteAll() {
    let url = `/accounts/delete`;

    try {
      const response = await this.api.get(url);
      return response.data;
    } catch (error) {
      return error;
    }
  }

  /**
   * @param {*} accountId - the accounts id
   * @returns a status message
   */
  async deleteOne(id) {
    let url = `/accounts/${id}`;

    try {
      const response = await this.api.delete(url);
      return response.data;
    } catch (error) {
      return error;
    }
  }
}

module.exports = Accounts;
