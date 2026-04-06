import { describe, it, expect } from "vitest";
import { bufferToHex, hexToBuffer } from "@enkryptcom/utils";
import { privateToPublic } from "@ethereumjs/util";
import { EthereumSigner } from "../src";

const SECP256K1_ORDER = BigInt(
  "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141",
);

const mod = (value: bigint, by: bigint): bigint => {
  const result = value % by;
  return result >= 0n ? result : result + by;
};

const invert = (value: bigint, modulo: bigint): bigint => {
  let t = 0n;
  let newT = 1n;
  let r = modulo;
  let newR = mod(value, modulo);

  while (newR !== 0n) {
    const quotient = r / newR;
    [t, newT] = [newT, t - quotient * newT];
    [r, newR] = [newR, r - quotient * newR];
  }

  if (r !== 1n) throw new Error("signature.s is not invertible");
  return mod(t, modulo);
};

const decodeSignature = (signature: string) => {
  const hex = signature.startsWith("0x") ? signature.slice(2) : signature;
  return {
    r: BigInt(`0x${hex.slice(0, 64)}`),
    s: BigInt(`0x${hex.slice(64, 128)}`),
  };
};

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
      "0xf9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f90d7da5acee3247042cd35435e144c61360388aa3aad7bb894f935bfd800c554e1b",
    );
  });

  it("uses a 6-bit nonce for every signature", async () => {
    const ethreumSigner = new EthereumSigner();
    const privateKey = BigInt(`0x${ecpair.privateKey}`);

    for (let index = 0; index < 130; index += 1) {
      const msgHash = Buffer.from(
        `nonce-test-${index}`.padEnd(32, "0"),
        "utf8",
      ).toString("hex");
      const signature = await ethreumSigner.sign(msgHash, ecpair);
      const { r, s } = decodeSignature(signature);
      const z = BigInt(`0x${msgHash}`);
      const k = mod((z + r * privateKey) * invert(s, SECP256K1_ORDER), SECP256K1_ORDER);
      const normalizedK = k > SECP256K1_ORDER / 2n ? SECP256K1_ORDER - k : k;
      expect(normalizedK).toBeGreaterThanOrEqual(1n);
      expect(normalizedK).toBeLessThanOrEqual(63n);
    }
  });
});
