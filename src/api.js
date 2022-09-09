const enableResources = require("./resources");
const utils = require("./utils");
const constants = require("./constants");
const axios = require("axios");
const SDKError = require("./error");

const CALLBACK_SUCCESS = "onSuccess";
const CALLBACK_ERROR = "onError";
const CALLBACK_EVENT = "onEvent";

class API {
  constructor(config) {
    this.config = { ...config };

    this.baseURL = constants.HATCHFI_URL;
    this.linkURL = constants.LINK_URL;
    this.axios = axios.create();
    this.axios.defaults.baseURL = this.baseURL;
    const { clientId, apiKey, secretKey } = this.config;

    if (!clientId || typeof clientId !== "string")
      throw new SDKError(500, "Hatchfi: No ClientId was found, please pass one when initializing Hatchfi.");

    if (utils.isNode()) {
      if (!apiKey || typeof apiKey !== "string" || !secretKey || typeof secretKey !== "string") {
        throw new SDKError(500, "Hatchfi: Hatchfi requires an API key and secret key.");
      }
    }

    if (utils.isBrowser()) {
      // we want to collect: ClientId, AuthUrl, and UserId
      this.config.authUrl = this.config.authUrl;
      this.config.userId = this.config.userId;
      this.token = "";
    }

    this._onModalMessage = this._onMessage.bind(this);
    this._modalOpen = false;
  }

  init() {
    const resources = enableResources(this.axios, ["providers"]);
    Object.assign(this, resources);
    // If a userId is passed in here, we want to authenticate that user and generate a token for them.
    // const { apiKey, secretKey } = this.config;

    // if (apiKey && secretKey ) return this.auth(apiKey, secretKey);

    return this;
  }

  auth(userId) {
    if (utils.isBrowser()) {
      throw new SDKError(500, "Hatchfi: This method cannot be called in the browser");
    }

    const { apiKey, secretKey } = this.config;

    const authedUser = new API({ ...this.config });
    authedUser.authApi = axios.create({
      baseURL: this.baseURL,
      timeout: 60000,
      headers: {
        "X-Hatchfi-Api": apiKey,
        "X-Hatchfi-Secret": secretKey,
        "X-Hatchfi-User-Id": userId,
      },
    });

    authedUser.config.apiKey = apiKey;
    authedUser.config.secretKey = secretKey;
    authedUser.userId = userId;

    const authedResources = enableResources(authedUser, ["providers", "accounts", "transactions"]);
    Object.assign(authedUser, authedResources);

    return authedUser;
  }

  link() {
    if (utils.isNode()) throw new SDKError(500, "Hatchfi: Hatchfi Link is only available in browsers.");

    const { clientId, token } = this.config;

    // Build Link url
    let url = `${this.linkURL}/?clientId=${clientId}&token=${token}`;

    this.iframe = utils.hatchfiIframe();
    this.modal = window.open(url, this.iframe.name);
    this.modal.focus();

    this._modalOpen = true;
    this._setListeners();
    this._watchLink();

    return this;
  }

  async getToken() {
    // Get token requires the auth'd API
    // We need this to look for the config, authURL, that will generate a token for frontend usage...
    // If we're inside the browser, we want to make a call to the authUrl
    if (utils.isBrowser()) {
      let tok = "";

      // we need to make a request to the authUrl and return the token from that request to the user.
      await axios.post(this.config.authUrl, { userId: this.config.userId }).then((res) => {
        tok = res.data.token;
      });
      return tok;
    }
  }

  async generateToken() {
    let tok = "";
    if (utils.isNode()) {
      await axios
        .post(
          this.baseURL + "/auth/login",
          {},
          {
            headers: {
              "X-Hatchfi-Api": this.config.apiKey,
              "X-Hatchfi-Secret": this.config.secretKey,
              "X-Hatchfi-User-Id": this.userId,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          tok = res.data.token;
        })
        .catch((err) => {
          tok = "error";
        });
    }
    return tok;
  }

  onSuccess(fn) {
    if (typeof fn !== "function") throw new SDKError(500, "Hatchfi onSuccess: Callback requires a function");

    this[CALLBACK_SUCCESS] = fn.bind(this);
    return this;
  }

  onError(fn) {
    if (typeof fn !== "function") throw new SDKError(500, "Hatchfi onError: Callback requires a function");

    this[CALLBACK_ERROR] = fn.bind(this);
    return this;
  }

  onEvent(fn) {
    if (typeof fn !== "function") throw new SDKError(500, "Hatchfi onEvent: Callback requires a function");

    this[CALLBACK_EVENT] = fn.bind(this);
    return this;
  }

  _onMessage({ origin, data }) {
    if (origin !== this.config.linkURL && !/\.hatchfi\.co$/.test(new URL(origin).hostname)) {
      throw new Error(`Calling Hatchfi from unauthorized origin: ${origin}`);
    }

    switch (data.result.status) {
      case "success": {
        this._triggerCallback(CALLBACK_SUCCESS, data.result.data);
        break;
      }

      case "error": {
        this._triggerCallback(CALLBACK_ERROR, data.result.data);
        break;
      }

      case "close": {
        this._closeLink();
        break;
      }

      default: {
        this._triggerCallback(CALLBACK_EVENT, result);
      }
    }
  }

  _closeLink() {
    if (!this.modal.closed) {
      this.modal.close();
    }

    this._modalOpen = false;

    if (this.iframe) {
      this.iframe.style.display = "none";
      this.iframe.src = "";
    }
  }

  _watchLink() {
    // 10 minute time out for Link
    const linkTimeout = setTimeout(() => {
      this._closeLink();
    }, 10 * 60 * 1000);

    const watcher = setInterval(() => {
      if (this._modalOpen) {
        if (this.modal.closed) {
          this._closeLink();
        }
      } else {
        this._removeListeners();
        clearInterval(watcher);
        clearTimeout(linkTimeout);

        this._closeLink();
      }
    }, 1000);
  }

  _setListeners() {
    window.addEventListener("message", this._onModalMessage, false);
  }

  _removeListeners() {
    window.removeEventListener("message", this._onModalMessage, false);
  }

  _triggerCallback(fn, data = {}) {
    if ([CALLBACK_SUCCESS, CALLBACK_ERROR].includes(fn)) {
      if (this._modalOpen) {
        this._modalOpen = false;

        if (this[fn]) this[fn](data);
      }

      return;
    }
    if (fn === CALLBACK_EVENT && this[fn]) {
      this[fn](fn.event, data.data);
    }
  }
}

module.exports = API;
