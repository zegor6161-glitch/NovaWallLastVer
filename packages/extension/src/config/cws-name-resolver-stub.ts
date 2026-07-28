export type CoinType = string;

export class GenericNameResolver {
  async resolveName(
    _name: string,
    _coins: CoinType[],
    _providerChain?: string,
  ): Promise<string | null> {
    return null;
  }
}
