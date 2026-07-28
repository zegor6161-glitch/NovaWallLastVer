import { sha256 as nobleSha256 } from '@noble/hashes/sha256';
import { bytesToHex, utf8ToBytes } from '@noble/hashes/utils';

const toBytes = (input: unknown): Uint8Array => {
  if (input instanceof Uint8Array) return input;
  if (input instanceof ArrayBuffer) return new Uint8Array(input);
  if (Array.isArray(input)) return Uint8Array.from(input);
  return utf8ToBytes(String(input ?? ''));
};

const digest = (input: unknown) => nobleSha256(toBytes(input));

const sha256: any = (input: unknown) => bytesToHex(digest(input));
sha256.hex = sha256;
sha256.array = (input: unknown) => Array.from(digest(input));
sha256.digest = sha256.array;
sha256.arrayBuffer = (input: unknown) => digest(input).buffer.slice(0);
sha256.create = () => {
  const chunks: Uint8Array[] = [];
  const api: any = {
    update(input: unknown) {
      chunks.push(toBytes(input));
      return api;
    },
    hex() {
      const size = chunks.reduce((sum, item) => sum + item.length, 0);
      const data = new Uint8Array(size);
      let offset = 0;
      for (const item of chunks) {
        data.set(item, offset);
        offset += item.length;
      }
      return bytesToHex(nobleSha256(data));
    },
  };
  api.toString = api.hex;
  api.array = () => Array.from(Uint8Array.from(Buffer.from(api.hex(), 'hex')));
  api.digest = api.array;
  api.arrayBuffer = () => Uint8Array.from(api.array()).buffer;
  return api;
};

export { sha256 };
export default sha256;
