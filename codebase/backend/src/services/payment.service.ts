import { PaymentRequest, PaymentResult } from "../domain";
import { PaymentClient, AccountsClient } from "../clients/types";
import { PaymentsRepo } from "../repositories/payments.repo";
import { isCardExpired } from "../utils/isCardExpired";
import { badRequest, notFound, paymentReq, upstreamFail, AppError } from "../utils/appError";


export class PaymentsService {
  constructor(
    private readonly payment: PaymentClient,
    private readonly repo: PaymentsRepo,
    private readonly accountsClient: AccountsClient
  ) {}

  async pay(req: PaymentRequest): Promise<PaymentResult> {
    // Throw an error when amount is 0 or less
     if (req.amount <= 0) {
      throw badRequest("BAD_AMOUNT", "Amount must be > 0");
    }
    // Throw an error when the card is expired
    if (isCardExpired(req.card.expiry)) {
      throw badRequest("CARD_EXPIRED", "The card is expired");
    }

    const accountExists = (await this.accountsClient.getAccounts()).some((a) => a.id === req.accountId);

    // Throw an error when the account is not exists
    if (!accountExists) {
      throw notFound("ACCOUNT_NOT_FOUND", "Account not found");
    }

    // idempotency (optional): if key provided and seen before, return saved result
    if (req.idempotencyKey) {
      const existing = this.repo.findByKey(req.idempotencyKey);
      if (existing) return existing;
    }
    
    let result: PaymentResult;
    try {
      result = await this.payment.charge(req);
    } catch (err: any) {
      // If processor already threw an AppError, just rethrow
      if (err instanceof AppError) throw err;

      // Map common processor failures to structured errors
      const code = String(err?.code ?? "");
      const message = String(err?.message ?? "Payment failed");

      // 402 - payment declined/required class of errors
      if (err?.statusCode === 402 || code === "CARD_DECLINED" || code === "CARD_EXPIRED") {
        throw paymentReq(code || "PAYMENT_FAILED", message);
      }

      // Anything else from the processor → treat as upstream failure (5xx)
      throw upstreamFail("PROCESSOR_ERROR", "Payment processor unavailable");
    }
    this.repo.save(result, req.idempotencyKey);
    return result;
  }

  async getPaymentHistory(): Promise<PaymentResult[]> {
    return this.repo.list();
  }
}
