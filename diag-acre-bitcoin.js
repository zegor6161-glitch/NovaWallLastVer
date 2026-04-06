try {
  const bitcoin = require("./node_modules/@blooo/hw-app-acre/node_modules/bitcoinjs-lib");
  console.log("nested bitcoinjs-lib OK");
  console.log(Object.keys(bitcoin).sort());
} catch (e) {
  console.error("nested bitcoinjs-lib FAIL");
  console.error(e && e.stack ? e.stack : e);
}
