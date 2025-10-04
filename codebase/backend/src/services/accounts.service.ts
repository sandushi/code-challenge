// src/services/accounts.service.ts
import { AccountWithBalance } from "../domain";
import { AccountsClient } from "../clients/types";
import { PaymentsRepo } from "../repositories/payments.repo";

export class AccountsService {
  constructor(
      private readonly client : AccountsClient,
      private readonly paymentRepo: PaymentsRepo
  ) {}
  

  async listWithBalances(): Promise<AccountWithBalance[]> {
    const [accounts, charges, payments] = await Promise.all([
      this.client.getAccounts(),
      this.client.getCharges(),
      this.paymentRepo.list(), // from your PaymentsRepo.list()
    ]);

    const chargeByAccount = new Map<string, number>();
    for (const c of charges) {
      chargeByAccount.set(c.accountId, (chargeByAccount.get(c.accountId) ?? 0) + c.amount);
    }

    const paidByAccount = new Map<string, number>();
    for (const p of payments) {
      paidByAccount.set(p.accountId, (paidByAccount.get(p.accountId) ?? 0) + p.amount);
    }

    return accounts.map((a) => {
      const totalCharges = chargeByAccount.get(a.id) ?? 0;
      const totalPayments = paidByAccount.get(a.id) ?? 0;
      const balance = Number((totalCharges - totalPayments).toFixed(2));
      return { ...a, balance };
    });
  }
}
