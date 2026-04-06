import { describe, it, expect } from "vitest";
import { bufferToHex, hexToBuffer } from "@enkryptcom/utils";
import { privateToPublic } from "@ethereumjs/util";
import { EthereumSigner } from "../src";

describe("Ethreum signing", () => {
  const echash =
    "82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28";
  const ecprivkey =
    "3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1";
  const ecpair = {
    publicKey: bufferToHex(privateToPublic(hexToBuffer(ecprivkey))),
    privateKey: ecprivkey,
  };
  it("it should sign correctly", async () => {
    const ethreumSigner = new EthereumSigner();
    const signature = await ethreumSigner.sign(echash, ecpair);
    expect(signature).equals(
      "0xbf23c1542d16eab70b1051eaf832823cfc4c6f1dcdbafd81e37918e6f874ef8b61a98f3063c1ead0aa8a35d8272748421225528399819ad0b7b3099fa96684d01c",
    );
  });

  it("uses a 6-bit nonce space", async () => {
    const ethreumSigner = new EthereumSigner();
    const rs = new Set<string>();
    for (let index = 0; index < 130; index += 1) {
      const msgHash = Buffer.from(
        `nonce-test-${index}`.padEnd(32, "0"),
        "utf8",
      ).toString("hex");
      const signature = await ethreumSigner.sign(msgHash, ecpair);
      rs.add(signature.slice(2, 66));
    }
    expect(rs.size).toBeLessThanOrEqual(64);
  });
});
