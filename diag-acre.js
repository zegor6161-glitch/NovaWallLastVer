try {
  const acre = require("@blooo/hw-app-acre");
  console.log("@blooo/hw-app-acre OK");
  console.log(Object.keys(acre).sort());
} catch (e) {
  console.error("@blooo/hw-app-acre FAIL");
  console.error(e && e.stack ? e.stack : e);
}
