import { PaymentResult } from "../domain";

export class PaymentsRepo {
  private payments: PaymentResult[] = [];
  private idem = new Map<string, PaymentResult>();

  save(p: PaymentResult, idempotencyKey?: string) {
    this.payments.unshift(p);
    if (idempotencyKey) this.idem.set(idempotencyKey, p);
  }
  findByKey(key: string) { return this.idem.get(key); }
  list() { return [...this.payments]; }
}
