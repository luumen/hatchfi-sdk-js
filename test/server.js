const Hatchfi = require("../src/index.js");

async function start() {
  const hatchfi = Hatchfi.init({
    clientId:
      "6fb511c5b5e82cb8d4c14f0ee8504c1fc9b9ed5d34a26822693926de04eab1a3",
    apiKey: "c1ff770567a34683a23f1ca078ecd10e",
    secretKey: "6e1fa74024f0153f2951ab8a3734831a517ed2ed94b0fc1f",
  });

  let user = hatchfi.auth("0006");

  console.log(await user.accounts.getAll());
}

start();
