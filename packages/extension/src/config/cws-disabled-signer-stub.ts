export class DisabledSigner {
  constructor(..._args: unknown[]) {}

  async generate(): Promise<never> {
    throw new Error('This signer is not available in the Terenval CWS release.');
  }

  async sign(): Promise<never> {
    throw new Error('This signer is not available in the Terenval CWS release.');
  }

  async verify(): Promise<boolean> {
    return false;
  }
}

export const PolkadotSigner = DisabledSigner;
export const KadenaSigner = DisabledSigner;
export const MassaSigner = DisabledSigner;
export default DisabledSigner;
