export interface Card {
    number: string;
    expiry: string;
    cvv: string; 
  }
  
  export interface PaymentRequest {
    accountId: string;
    amount: number;
    card: Card;
    idempotencyKey?: string;
  }
  
  export interface PaymentResult {
    id: string;
    accountId: string;
    amount: number;
    last4: string;
    createdAt: string;
    status: "succeeded" | "failed";
    reason?: string;
  }
  