// src/services/accounts.service.ts
import { AccountWithBalance } from "../domain";
import { AccountsClient } from "../clients/types";

export class AccountsService {
  constructor(
      private readonly client : AccountsClient,
  ) {}
  
  async listWithBalances(): Promise<AccountWithBalance[]> {
    const [accounts, charges] = await Promise.all([
      this.client.getAccounts(),
      this.client.getCharges(),
    ]);

    const chargeByAccount = new Map<string, number>();
    for (const c of charges) {
      chargeByAccount.set(c.accountId, (chargeByAccount.get(c.accountId) ?? 0) + c.amount);
    }

    return accounts.map((a) => {
      const balance = chargeByAccount.get(a.id) ?? 0;
      return { ...a, balance };
    });
  }
}
