/**
 * Audits grants access to Hatchfi's user NFT data
 */
class Audits {
  constructor(auth) {
    this.api = auth.authApi;
    this.userId = auth.userId;
  }

  /**
   *
   *
   * @returns an array of audit objects
   */
  async getAll(accountId) {
    if (!accountId || typeof accountId !== "string") {
      throw new Error("Please provide a valid Hatchfi account id.");
    }

    try {
      const response = await this.api.get("/accounts/" + accountId + "/audits");
      return response.data;
    } catch (error) {
      return error;
    }
  }
}

module.exports = Audits;
