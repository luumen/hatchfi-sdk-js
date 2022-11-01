const Hatchfi = require("../src/index.js");

async function start() {
  const hatchfi = Hatchfi.init({
    clientId: "7e59d0ff39d4902b5cd2b7f5f0e695167402b859c7e585562a116b45b61910a8",
    apiKey: "ceab391bac854e86a4808c8d2a9aa73a",
    secretKey: "92ca6ac10a7193327cb8fc8cdeb1a8d6b84530ada58815eb",
  });

  let user = await hatchfi.auth("0003");

  let market = await user.market.fiatRates();
}

(async () => {
  await start();
})();
