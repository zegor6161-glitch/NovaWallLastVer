import { ProductAnalyticsEvent } from './types';

const MAX_QUEUE_SIZE = 20;
const RETRY_DELAY_MS = 2000;

export class AnalyticsTransport {
  private readonly endpoint: string;
  private queue: ProductAnalyticsEvent[] = [];
  private isFlushing = false;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  enqueue(event: ProductAnalyticsEvent) {
    if (this.queue.length >= MAX_QUEUE_SIZE) this.queue.shift();
    this.queue.push(event);
    this.flush().catch(() => undefined);
  }

  private async flush() {
    if (this.isFlushing || !this.queue.length) return;
    this.isFlushing = true;
    while (this.queue.length) {
      const event = this.queue[0];
      try {
        await fetch(this.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event),
        });
        this.queue.shift();
      } catch {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        break;
      }
    }
    this.isFlushing = false;
  }
}
