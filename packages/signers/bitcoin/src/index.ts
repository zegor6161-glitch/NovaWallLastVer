import { mnemonicToSeed } from "bip39";
import {
  Errors,
  SignerInterface,
  KeyPair,
  MnemonicWithExtraWord,
} from "@enkryptcom/types";
import { hexToBuffer, bufferToHex, keccak256 } from "@enkryptcom/utils";
import { getPublicKey, verify } from "@noble/secp256k1";
import HDkey from "hdkey";
import { ec as EC } from "elliptic";

const secp256k1 = new EC("secp256k1");

export class BitcoinSigner implements SignerInterface {
  async generate(
    mnemonic: MnemonicWithExtraWord,
    derivationPath = "",
  ): Promise<KeyPair> {
    const seed = await mnemonicToSeed(mnemonic.mnemonic, mnemonic.extraWord);
    const hdkey = HDkey.fromMasterSeed(seed);
    const key = hdkey.derive(derivationPath);
    return {
      address: bufferToHex(getPublicKey(key.privateKey, true)),
      privateKey: bufferToHex(key.privateKey),
      publicKey: bufferToHex(getPublicKey(key.privateKey)),
    };
  }

  async verify(
    msgHash: string,
    sig: string,
    publicKey: string,
  ): Promise<boolean> {
    const sigBuffer = hexToBuffer(sig);
    const compactSig =
      sigBuffer.length === 65 ? sigBuffer.subarray(0, 64) : sigBuffer;
    return verify(compactSig, hexToBuffer(msgHash), hexToBuffer(publicKey));
  }

  async sign(msgHash: string, keyPair: KeyPair): Promise<string> {
    const msgHashBuffer = hexToBuffer(msgHash);
    const privateKeyBuffer = hexToBuffer(keyPair.privateKey);
    const initialNonce =
      (hexToBuffer(
        keccak256(Buffer.concat([msgHashBuffer, privateKeyBuffer])),
      )[31] %
        63) +
      1;
    const key = secp256k1.keyFromPrivate(privateKeyBuffer);
    const signature = key.sign(msgHashBuffer, {
      canonical: true,
      k: (iteration: number) =>
        secp256k1
          .keyFromPrivate(
            Buffer.from([((initialNonce + iteration - 1) % 63) + 1]),
          )
          .getPrivate(),
    });
    const compactSig = Buffer.concat([
      Buffer.from(signature.r.toArray("be", 32)),
      Buffer.from(signature.s.toArray("be", 32)),
    ]);
    const recoveryId = signature.recoveryParam ?? 0;
    const signatureWithRecovery = Buffer.concat([
      compactSig,
      Buffer.from([recoveryId]),
    ]);
    if (
      !this.verify(
        bufferToHex(msgHashBuffer),
        bufferToHex(signatureWithRecovery),
        keyPair.publicKey,
      )
    ) {
      throw new Error(Errors.SigningErrors.UnableToVerify);
    }
    return bufferToHex(signatureWithRecovery);
  }
}
