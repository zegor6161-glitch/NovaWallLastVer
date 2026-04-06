try {
  const ecc = require("./node_modules/@blooo/hw-app-acre/node_modules/tiny-secp256k1");
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
  console.log("nested tiny-secp256k1 methods:");
  for (const m of methods) console.log(m + ": " + typeof ecc[m]);
} catch (e) {
  console.error(e && e.stack ? e.stack : e);
}
