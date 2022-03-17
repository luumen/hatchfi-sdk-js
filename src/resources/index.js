const RESOURCES = {
  accounts: require("./accounts"),
  providers: require("./providers"),
  transactions: require("./transactions"),
};

module.exports = function enableResources(api, resources) {
  return resources.reduce((res, resource) => {
    res[resource] = new RESOURCES[resource](api);
    return res;
  }, {});
};
