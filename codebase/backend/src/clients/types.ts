import { Account, Charge, PaymentRequest, PaymentResult } from "../domain";

export interface AccountsClient {
    getAccounts(): Promise<Account[]>;
    getCharges(): Promise<Charge[]>;
}
  
export interface PaymentClient { 
    charge(req: PaymentRequest): Promise<PaymentResult>; 
}
