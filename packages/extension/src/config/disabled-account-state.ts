export default class DisabledAccountState {
  async isConnected(): Promise<boolean> {
    return false;
  }

  async deleteState(): Promise<void> {
    return;
  }

  async addApprovedAddress(): Promise<void> {
    return;
  }
}
