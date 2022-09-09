/**
 * Accounts grants access to Hatchfi's user account data
 */
class Accounts {
  constructor(auth) {
    this.api = auth.authApi;
    this.userId = auth.userId;
  }

  /**
   *
   * Returns all of the selected users accounts
   * @returns an account array
   */
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
   * @param {string} accountId - the accounts id
   * @returns an account object
   */
  async getOne(accountId) {
    let url = `/accounts/${accountId}`;

    try {
      const response = await this.api.get(url);
      return response.data;
    } catch (error) {
      return error;
    }
  }

  /**
   *
   * @param {string} accountId - the accounts id
   * @returns a success message
   */
  async sync(accountId) {
    let url = `/accounts/${accountId}/sync`;

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
      const response = await this.api.delete(url);
      return response.data;
    } catch (error) {
      return { error: "Unable to delete all accounts" };
    }
  }

  /**
   * @param {string} accountId - the accounts id
   * @returns a status message
   */
  async deleteOne(accountId) {
    let url = `/accounts/${accountId}`;

    try {
      const response = await this.api.delete(url);
      return response.data;
    } catch (error) {
      return { error: "Unable to delete this account" };
    }
  }
}

module.exports = Accounts;
