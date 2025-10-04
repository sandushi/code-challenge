import { PaymentRequest, PaymentResult } from "../domain";
import { PaymentClient } from "./types";

export const PaymentApi: PaymentClient = {
  charge: (input: PaymentRequest) =>
    new Promise<PaymentResult>((resolve, reject) => {
      setTimeout(() => {
        const normalized = input.card.number.replace(/\s+/g, "");

        // decline rule 1: card number ends with 0000
        if (normalized.endsWith("0000")) {
          return reject(
            Object.assign(new Error("Card declined"), {
              statusCode: 402,
              code: "CARD_DECLINED"
            })
          );
        }

        resolve({
          id: `pay_${Math.random().toString(36).slice(2, 10)}`,
          accountId: input.accountId,
          amount: input.amount,
          last4: normalized.slice(-4),
          createdAt: new Date().toISOString(),
          status: "succeeded"
        });
      }, 400);
    })
};
