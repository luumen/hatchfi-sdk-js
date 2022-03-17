const Hatchfi = require("../src/index.js");

// THIS IS A SUPER SIMPLE IMPLEMENTATION AND TEST OF HATCHFI JS SDK

document.onreadystatechange = async () => {
  if (document.readyState !== "complete") {
    return;
  }

  const output = document.querySelector("#output");

  // ** EXAMPLES **

  // const hatchfi = await Hatchfi.init({
  //   clientId: '<YOUR CLIENT ID>',
  //   baseUrl: 'https://api.hatchfi.co',
  //   linkUrl: 'https://connect.hatchfi.com',
  //   env: 'sandbox'
  // })

  // Initiate Hatchfi SDK, replace the `clientId` field with your app key generated at hatchfi.com
  const hatchfi = await Hatchfi.init({
    clientId:
      "6fb511c5b5e82cb8d4c14f0ee8504c1fc9b9ed5d34a26822693926de04eab1a3",
    baseUrl: "https://api.hatchfi.co",
    linkUrl: "https://link.hatchfi.co",
    env: "live",
  });

  hatchfi.accounts
    .get()
    .then((account) => {
      printOutput(account);
      document.querySelector(".methods").style.display = "block";
      bindOtherMethods();
    })
    .catch((e) => {
      console.log("Not connected yet");
    });

  // Bind "connect" button
  document.querySelector("#connect").addEventListener("click", (ev) => {
    console.log("click");
    hatchfi
      .connect()
      .onConnection((account) => {
        console.log("account connected:", account);
        printOutput(account);

        document.querySelector(".methods").style.display = "block";
        bindOtherMethods();
      })
      .onError((error) => {
        console.error("account connection error:", error);
        printOutput(error);
      });
  });

  // Bind buttons for the other SDK example methods [Requires a successful hatchfi.connect() first]
  function bindOtherMethods() {
    console.log("hatchfi", hatchfi);
    document.querySelector("#getBalance").addEventListener("click", (ev) => {
      // Get ETH balance
      hatchfi.accounts
        .getBalances({ tickers: ["ETH"] })
        .then((balances) => {
          printOutput(balances);
        })
        .catch((error) => {
          /* User has not yet connected or doesn't have an ether wallet */
          printOutput(error);
        });
    });

    document.querySelector("#getHistory").addEventListener("click", (ev) => {
      // Get account transactions history
      hatchfi.transactions
        .getList({ ticker: "ETH" })
        .then((history) => {
          printOutput(history);
        })
        .catch((error) => {
          /* User has not yet connected */
          printOutput(error);
        });
    });

    document
      .querySelector("#getExchangeRates")
      .addEventListener("click", (ev) => {
        // Get crypto USD exchange rates
        hatchfi.currencies
          .getExchangeRates()
          .then((rates) => {
            printOutput(rates);
          })
          .catch((error) => {
            /* Something went wrong */
            printOutput(error);
          });
      });
  }

  // Output print helper function
  function printOutput(obj) {
    output.innerHTML = `<pre>${JSON.stringify(obj, null, 2)}</pre>`;
  }
};
