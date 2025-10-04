export type EnergyType = "ELECTRICITY" | "GAS";


export interface Account {
    id: string;
    type: EnergyType;
    address: string;
    meterNumber?: number,
    volume?:number,
    balance: number; // >0 amount due, <0 in credit, 0 settled
}


export type PaymentRequest = {
  accountId: string;
  amount: number;
  card: {
    number: string;
    expiry: string; // "MM/YY"
    cvv: string;
  };
};

export type PaymentResponse = {
  id: string;
  accountId: string;
  amount: number;
  last4: number;
  createdAt: string;    // ISO
  status: string;     // Payment Status
};