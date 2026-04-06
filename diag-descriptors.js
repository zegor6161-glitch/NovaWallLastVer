try {
  const d = require("@bitcoinerlab/descriptors");
  console.log("@bitcoinerlab/descriptors OK");
  console.log(Object.keys(d).slice(0, 30));
} catch (e) {
  console.error("@bitcoinerlab/descriptors FAIL");
  console.error(e && e.stack ? e.stack : e);
}
