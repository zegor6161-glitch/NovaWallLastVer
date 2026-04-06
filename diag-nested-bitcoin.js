try {
  const ecc = require("./node_modules/@blooo/hw-app-acre/node_modules/tiny-secp256k1");
  const bitcoin = require("./node_modules/@blooo/hw-app-acre/node_modules/bitcoinjs-lib");
  console.log("nested bitcoinjs-lib loaded");

  if (typeof bitcoin.initEccLib === "function") {
    bitcoin.initEccLib(ecc);
    console.log("nested bitcoin.initEccLib OK");
  } else {
    console.log("nested bitcoinjs-lib has no initEccLib");
  }
} catch (e) {
  console.error("nested bitcoin ECC FAIL");
  console.error(e && e.stack ? e.stack : e);
}
