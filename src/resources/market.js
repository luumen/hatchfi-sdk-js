/**
 * Market grants access to Hatchfi's user NFT data
 */
class Market {
  constructor(auth) {
    this.api = auth.authApi;
    this.userId = auth.userId;
  }

  /**
   *
   * @param {string} ticker - a cryptocurrency ticker
   * @returns an object
   */
  async currentRate(ticker) {
    if (!ticker || typeof ticker !== "string") {
      throw new Error("Please provide a valid ticker.");
    }

    try {
      const response = await this.api.get("/market/exchange/" + ticker);
      return response.data;
    } catch (error) {
      return error;
    }
  }

  /**
   *
   * @param {string} ticker - a cryptocurrency ticker
   * @returns an array of pricing objects
   */
  async historicalRates(ticker) {
    if (!ticker || typeof ticker !== "string") {
      throw new Error("Please provide a valid ticker.");
    }

    try {
      const response = await this.api.get("/market/exchange/" + ticker + "/history");
      return response.data;
    } catch (error) {
      return error;
    }
  }

  /**
   *
   * @returns an array of fiat rate objects
   */
  async fiatRates() {
    try {
      const response = await this.api.get("/market/fiat/exchange");
      return response.data;
    } catch (error) {
      return error;
    }
  }
}

module.exports = Market;
