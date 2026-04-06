try {
  const ecc = require("tiny-secp256k1");
  const { ECPairFactory } = require("ecpair");
  const ECPair = ECPairFactory(ecc);
  console.log("ECPairFactory OK", typeof ECPair);
} catch (e) {
  console.error("ECPairFactory FAIL");
  console.error(e && e.stack ? e.stack : e);
}
