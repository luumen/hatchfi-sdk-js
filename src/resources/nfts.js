/**
 * NFTs grants access to Hatchfi's user NFT data
 */
class NFTs {
  constructor(auth) {
    this.api = auth.authApi;
    this.userId = auth.userId;
  }

  /**
   *
   *
   * @returns an array of transaction objects
   */
  async getAll(accountId) {
    if (!accountId || typeof accountId !== "string") {
      throw new Error("Please provide a valid Hatchfi account id.");
    }

    try {
      const response = await this.api.get("/accounts/" + accountId + "/nfts");
      return response.data;
    } catch (error) {
      return error;
    }
  }
}

module.exports = NFTs;
