import { describe, it, expect } from "vitest";
import { bufferToHex, hexToBuffer } from "@enkryptcom/utils";
import { getPublicKey } from "@noble/secp256k1";
import { BitcoinSigner } from "../src";
import fixtures from "./fixtures";

describe("Bitcoin signing", () => {
  it("it should sign correctly", { timeout: 20_000 }, async () => {
    const bitcoinSigner = new BitcoinSigner();
    const promises = fixtures.valid.map(async (f) => {
      const keyPair = {
        publicKey: bufferToHex(getPublicKey(hexToBuffer(f.d))),
        privateKey: `0x${f.d}`,
      };
      const sig = await bitcoinSigner.sign(f.m, keyPair);
      const sig2 = await bitcoinSigner.sign(f.m, keyPair);
      expect(sig).equals(sig2);
      await expect(
        bitcoinSigner.verify(f.m, sig, keyPair.publicKey),
      ).resolves.toBe(true);
    });
    await Promise.all(promises);
  });
});
