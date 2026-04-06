try {
  const ecc = require("tiny-secp256k1");
  console.log("tiny-secp256k1 OK");
  console.log(Object.keys(ecc).sort());
} catch (e) {
  console.error("tiny-secp256k1 FAIL");
  console.error(e && e.stack ? e.stack : e);
}
