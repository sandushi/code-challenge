import { PaymentsService } from "../../src/services/payment.service"; // <-- ensure this path matches your file name
import type { PaymentClient, AccountsClient } from "../../src/clients/types";
import type { PaymentsRepo } from "../../src/repositories/payments.repo";
import type { PaymentRequest, PaymentResult, Account } from "../../src/domain";

// Mock the expiry util used inside the service
jest.mock("../../src/utils/isCardExpired", () => ({
  isCardExpired: jest.fn()
}));
import { isCardExpired } from "../../src/utils/isCardExpired";

describe("PaymentsService", () => {
  // --- helpers / fixtures ---
  const validReq = (overrides: Partial<PaymentRequest> = {}): PaymentRequest => ({
    accountId: "A-0001",
    amount: 25,
    idempotencyKey: undefined,
    card: {
      number: "4242424242424242",
      expiry: "12/28",
      cvv: "123",
    },
    ...overrides,
  });

  const accounts: Account[] = [
    { id: "A-0001", type: "ELECTRICITY", address: "1 Greville", meterNumber: "123" },
  ];

  const successResult: PaymentResult = {
    id: "pay_abc123",
    accountId: "A-0001",
    amount: 25,
    last4: "4242",
    createdAt: "2025-10-03T00:00:00.000Z",
    status: "succeeded",
  };

  // --- mocks ---
  let paymentClient: jest.Mocked<PaymentClient>;
  let accountsClient: jest.Mocked<AccountsClient>;
  let repo: jest.Mocked<PaymentsRepo>;

  beforeEach(() => {
    jest.clearAllMocks();

    (isCardExpired as jest.Mock).mockReturnValue(false);

    paymentClient = {
      charge: jest.fn().mockResolvedValue(successResult),
    };

    accountsClient = {
      getAccounts: jest.fn().mockResolvedValue(accounts),
    } as any;

    repo = {
      save: jest.fn(),
      list: jest.fn().mockReturnValue([]),
      findByKey: jest.fn(),
    } as any;
  });

  test("success: charges via PaymentClient, saves to repo, returns result", async () => {
    const svc = new PaymentsService(paymentClient, repo, accountsClient);

    const res = await svc.pay(validReq());

    expect(isCardExpired).toHaveBeenCalledWith("12/28");
    expect(accountsClient.getAccounts).toHaveBeenCalledTimes(1);
    expect(paymentClient.charge).toHaveBeenCalledTimes(1);
    expect(paymentClient.charge).toHaveBeenCalledWith(expect.objectContaining({ accountId: "A-0001", amount: 25 }));
    expect(repo.save).toHaveBeenCalledWith(successResult, undefined);
    expect(res).toEqual(successResult);
  });

  test("error: amount <= 0", async () => {
    const svc = new PaymentsService(paymentClient, repo, accountsClient);
    await expect(svc.pay(validReq({ amount: 0 }))).rejects.toMatchObject({
      status: 400,
      code: "BAD_AMOUNT",
    });
    expect(paymentClient.charge).not.toHaveBeenCalled();
    expect(repo.save).not.toHaveBeenCalled();
  });

  test("error: card expired (via isCardExpired)", async () => {
    (isCardExpired as jest.Mock).mockReturnValue(true);
    const svc = new PaymentsService(paymentClient, repo, accountsClient);

    await expect(svc.pay(validReq())).rejects.toMatchObject({
      status: 400, 
      code: "CARD_EXPIRED",
      message: "The card is expired",
    });

    expect(paymentClient.charge).not.toHaveBeenCalled();
    expect(repo.save).not.toHaveBeenCalled();
  });

  test("error: account not found", async () => {
    accountsClient.getAccounts.mockResolvedValueOnce([]); // no accounts
    const svc = new PaymentsService(paymentClient, repo, accountsClient);

    await expect(svc.pay(validReq())).rejects.toMatchObject({
      status: 404,
      code: "ACCOUNT_NOT_FOUND",
    });

    expect(paymentClient.charge).not.toHaveBeenCalled();
    expect(repo.save).not.toHaveBeenCalled();
  });

  test("idempotency: returns existing and does NOT call charge/save", async () => {
    repo.findByKey.mockReturnValueOnce(successResult);
    const svc = new PaymentsService(paymentClient, repo, accountsClient);

    const res = await svc.pay(validReq({ idempotencyKey: "key-1" }));

    expect(repo.findByKey).toHaveBeenCalledWith("key-1");
    expect(paymentClient.charge).not.toHaveBeenCalled();
    expect(repo.save).not.toHaveBeenCalled();
    expect(res).toBe(successResult);
  });

  test("saves with idempotencyKey when provided", async () => {
    const svc = new PaymentsService(paymentClient, repo, accountsClient);

    await svc.pay(validReq({ idempotencyKey: "key-2" }));

    expect(repo.save).toHaveBeenCalledWith(successResult, "key-2");
  });

  test("processor decline is mapped to 402 paymentReq", async () => {
    const decline = Object.assign(new Error("Card declined"), { statusCode: 402, code: "CARD_DECLINED" });
    paymentClient.charge.mockRejectedValueOnce(decline);

    const svc = new PaymentsService(paymentClient, repo, accountsClient);

    await expect(svc.pay(validReq())).rejects.toMatchObject({
      status: 402,
      code: "CARD_DECLINED",
      message: "Card declined",
    });

    expect(repo.save).not.toHaveBeenCalled();
  });

  test("processor unknown error is mapped to 502 upstreamFail", async () => {
    paymentClient.charge.mockRejectedValueOnce(new Error("Socket hang up"));

    const svc = new PaymentsService(paymentClient, repo, accountsClient);

    await expect(svc.pay(validReq())).rejects.toMatchObject({
      status: 502,
      code: "PROCESSOR_ERROR",
      message: "Payment processor unavailable",
    });

    expect(repo.save).not.toHaveBeenCalled();
  });

  test("getPaymentHistory returns repo.list()", async () => {
    const history: PaymentResult[] = [
      { ...successResult, id: "pay_1" },
      { ...successResult, id: "pay_2" },
    ];
    repo.list.mockReturnValueOnce(history);

    const svc = new PaymentsService(paymentClient, repo, accountsClient);
    const res = await svc.getPaymentHistory();

    expect(repo.list).toHaveBeenCalledTimes(1);
    expect(res).toEqual(history);
  });
});
