import { Account, Charge } from "../domain";
import { MOCK_ENERGY_ACCOUNTS_API } from "../clients/energyAccounts.client";
import { MOCK_DUE_CHARGES_API } from "../clients/dueCharges.client";

export interface AccountsClient {
  getAccounts(): Promise<Account[]>;
  getCharges(): Promise<Charge[]>;
}

export const AccountsApi: AccountsClient = {
  getAccounts: async () => {
    // Calling the mock enegery account api to get the accounts
    return await MOCK_ENERGY_ACCOUNTS_API();
  },
  getCharges: async () => {
    // Calling the mock due charges api to get the account balances
    return await MOCK_DUE_CHARGES_API();
  }
};
