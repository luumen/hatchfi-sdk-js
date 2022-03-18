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
    const { clientId } = this.config;

    if (!clientId || typeof clientId !== "string")
      throw new SDKError(
        500,
        "Hatchfi: No ClientId was found, please pass one when initializing Hatchfi."
      );

    this._onModalMessage = this._onMessage.bind(this);
    this._modalOpen = false;
  }

  init() {
    const resources = enableResources(this.axios, ["providers"]);
    Object.assign(this, resources);

    // If a local_id is passed in here, we want to authenticate that user and generate a token for them.
    const { localId } = this.config;

    if (localId) console.log("this user needs a token generated with /login");

    return this;
  }

  link() {
    if (utils.isNode())
      throw new SDKError(
        500,
        "Hatchfi: Hatchfi Link is only available in browsers."
      );

    const { clientId, token } = this.config;

    // Build Link url
    let url = `${this.linkURL}/?client_id=${clientId}&token=${
      token ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhbF9pZCI6IjAwMDQiLCJpYXQiOjE2NDc2MjU3NzAsImV4cCI6MTY0NzYzMjk3MH0.HS8ymoN4LAF5rGM3K4PKevq4PoEp9oOBUagAwGrFgvA"
    }`;

    this.iframe = utils.hatchfiIframe();
    this.modal = window.open(url, this.iframe.name);
    this.modal.focus();

    this._modalOpen = true;
    this._setListeners();
    this._watchLink();

    return this;
  }

  onSuccess(fn) {
    if (typeof fn !== "function")
      throw new SDKError(
        500,
        "Hatchfi onSuccess: Callback requires a function"
      );

    this[CALLBACK_SUCCESS] = fn.bind(this);
    return this;
  }

  onError(fn) {
    if (typeof fn !== "function")
      throw new SDKError(500, "Hatchfi onError: Callback requires a function");

    this[CALLBACK_ERROR] = fn.bind(this);
    return this;
  }

  onEvent(fn) {
    if (typeof fn !== "function")
      throw new SDKError(500, "Hatchfi onEvent: Callback requires a function");

    this[CALLBACK_EVENT] = fn.bind(this);
    return this;
  }

  _onMessage({ origin, data }) {
    if (
      origin !== this.config.linkURL &&
      !/\.hatchfi\.co$/.test(new URL(origin).hostname)
    ) {
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
    // 5 minute time out for Link
    const linkTimeout = setTimeout(() => {
      this._closeLink();
    }, 5 * 60 * 1000);

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
