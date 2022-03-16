"use strict";

/**
 * SDKError lets us throw a custom error when needed.
 *
 * @param code Provide error code, ex: `400`
 * @param message Add error message
 * @param requestId
 */
class SDKError extends Error {
  constructor(code, message, requestId, ...params) {
    super(message, ...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SDKError);
    }

    this.error_code = code;
    this.requestId = requestId;

    return this;
  }
}

module.exports = SDKError;
