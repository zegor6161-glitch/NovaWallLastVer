import { describe, it, expect, vi } from 'vitest';
import PublicKeyRing from '../public-keyring';
import { Errors } from '@enkryptcom/types';

describe('PublicKeyRing.getAccount', () => {
  it('returns account for exact key', async () => {
    const account = { address: '0xabcDEF0000000000000000000000000000000000' };
    const context = {
      getKeysObject: vi.fn().mockResolvedValue({ [account.address]: account }),
    };

    const result = await PublicKeyRing.prototype.getAccount.call(
      context,
      account.address,
    );

    expect(result).toEqual(account);
  });

  it('resolves EVM address case-insensitively', async () => {
    const stored = '0xAbCdEF0000000000000000000000000000000000';
    const account = { address: stored };
    const context = {
      getKeysObject: vi.fn().mockResolvedValue({ [stored]: account }),
    };

    const result = await PublicKeyRing.prototype.getAccount.call(
      context,
      '0xabcdef0000000000000000000000000000000000',
    );

    expect(result).toEqual(account);
  });

  it('resolves EVM address without 0x prefix', async () => {
    const stored = '0xabcdef0000000000000000000000000000000000';
    const account = { address: stored };
    const context = {
      getKeysObject: vi.fn().mockResolvedValue({ [stored]: account }),
    };

    const result = await PublicKeyRing.prototype.getAccount.call(
      context,
      'abcdef0000000000000000000000000000000000',
    );

    expect(result).toEqual(account);
  });

  it('throws for unknown address', async () => {
    const context = {
      getKeysObject: vi.fn().mockResolvedValue({}),
    };

    await expect(
      PublicKeyRing.prototype.getAccount.call(
        context,
        '0xabcdef0000000000000000000000000000000000',
      ),
    ).rejects.toThrow(Errors.KeyringErrors.AddressDoesntExists);
  });
});
