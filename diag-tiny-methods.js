try {
  const ecc = require("tiny-secp256k1");
  const methods = [
    "isPoint",
    "isPrivate",
    "pointFromScalar",
    "pointCompress",
    "pointMultiply",
    "xOnlyPointAddTweak",
    "privateAdd",
    "privateNegate",
    "sign",
    "verify"
  ];
  for (const m of methods) {
    console.log(m + ": " + typeof ecc[m]);
  }
} catch (e) {
  console.error(e && e.stack ? e.stack : e);
}
