/**
 * Transactions grants access to Hatchfi's user transaction data
 */
class Transactions {
  constructor(auth) {
    this.api = auth.authApi;
    this.userId = auth.userId;
  }

  /**
   *
   *
   * @returns an array of transaction objects
   */
  async getAll(accountId, limit = 1500, timestamp = new Date().getTime()) {
    if (!accountId || typeof accountId !== "string") {
      throw new Error("Please provide a valid Hatchfi account id.");
    }

    try {
      const response = await this.api.get("/accounts/" + accountId + "/transactions?limit=" + limit + "&timestamp=" + timestamp);
      return response.data;
    } catch (error) {
      return error;
    }
  }

  /**
   * Query and return a specific transaction based on its ID and Account ID.
   * @param {string} accountId - the accounts id
   * @param {string} transactionId - the transactions id
   * @returns an account object
   */
  async getOne(accountId, transactionId) {
    if (!accountId || typeof accountId !== "string") {
      throw new Error("Please provide a valid Hatchfi account id.");
    }

    if (!transactionId || typeof transactionId !== "string") {
      throw new Error("Please provide a valid transaction id.");
    }

    try {
      const response = await this.api.get("/accounts/" + accountId + "/transactions/" + transactionId);
      return response.data;
    } catch (error) {
      return error;
    }
  }
}

module.exports = Transactions;
