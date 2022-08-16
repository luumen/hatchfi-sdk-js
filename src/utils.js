"use strict";
const SDKError = require("./error");

const isBrowser = () => {
  return typeof window !== "undefined" && {}.toString.call(window) === "[object Window]";
};

const isReactNative = () => {
  return typeof navigator !== "undefined" && navigator.product === "ReactNative";
};

const isNode = () => {
  return typeof global !== "undefined" && {}.toString.call(global) === "[object global]";
};

function hatchfiIframe() {
  const name = "hatchfi-link-widget";
  let iframe = document.getElementsByName(name)[0];

  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.name = name;
    iframe.frameBorder = 0;
    iframe.setAttribute(
      "style",
      [
        "width:100%; height:100%;",
        "position:fixed;",
        "allowTransparency:true;",
        "top:0; left:0; right:0; bottom:0;",
        "z-index:2147483647;", // max possible z-index
      ].join(" ")
    );

    document.body.appendChild(iframe);
  }

  iframe.style.display = "block";

  return iframe;
}

module.exports = {
  isBrowser,
  isNode,
  isReactNative,
  hatchfiIframe,
};
