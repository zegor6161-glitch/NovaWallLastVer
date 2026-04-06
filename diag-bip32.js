try {
  const ecc = require("tiny-secp256k1");
  const { BIP32Factory } = require("bip32");
  const bip32 = BIP32Factory(ecc);
  console.log("BIP32Factory OK", typeof bip32);
} catch (e) {
  console.error("BIP32Factory FAIL");
  console.error(e && e.stack ? e.stack : e);
}
