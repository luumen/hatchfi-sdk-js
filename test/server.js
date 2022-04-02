const Hatchfi = require("../src/index.js");

async function start() {
  const hatchfi = Hatchfi.init({
    clientId:
      "8bca519be0669f073a30a37458d44bf7c421334a3314ef8dade723e44159e566",
    apiKey: "195b3222e96741b4baeb4abc1f00a939",
    secretKey: "5df6cf0277825a4222635e55a81d901e42d7a944fa0ab587",
  });

  let user = hatchfi.auth("0003");
  console.log(await user.generateToken());
}

start();
