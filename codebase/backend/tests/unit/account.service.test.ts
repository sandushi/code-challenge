import { AccountsService } from "../../src/services/accounts.service";
import type { Account, Charge, PaymentResult } from "../../src/domain";
import type { AccountsClient } from "../../src/clients/types";
import type { PaymentsRepo } from "../../src/repositories/payments.repo";

describe("AccountsService.listWithBalances", () => {
  // --- test fixtures ---
  const accounts: Account[] = [
    { id: "A-0001", type: "ELECTRICITY", address: "1 Greville Ct", meterNumber: "123" },
    { id: "A-0002", type: "GAS",         address: "74 Taltarni Rd",  volume: 1000 },
    { id: "A-0003", type: "ELECTRICITY", address: "44 William Rd",   meterNumber: "456" },
  ];

  const charges: Charge[] = [
    { id: "D-1", accountId: "A-0001", date: "2025-04-01", amount: 10 },
    { id: "D-2", accountId: "A-0001", date: "2025-04-08", amount: 20 },
    { id: "D-3", accountId: "A-0003", date: "2025-03-25", amount: -15 },
    { id: "D-4", accountId: "A-0003", date: "2025-04-05", amount: -25 },
  ];

  const payments: PaymentResult[] = [
    { id: "pay_1", accountId: "A-0001", amount: 5,  last4: "4242", createdAt: "2025-10-03T00:00:00Z", status: "succeeded" },
    { id: "pay_2", accountId: "A-0001", amount: 10, last4: "4242", createdAt: "2025-10-03T00:10:00Z", status: "succeeded" },
    { id: "pay_3", accountId: "A-0002", amount: 12.345, last4: "1111", createdAt: "2025-10-03T00:20:00Z", status: "succeeded" },
  ];

  // --- mocks ---
  const mockClient: jest.Mocked<AccountsClient> = {
    getAccounts: jest.fn().mockResolvedValue(accounts),
    getCharges: jest.fn().mockResolvedValue(charges),
  };

  const mockPaymentsRepo: jest.Mocked<PaymentsRepo> = {
    // only list is used by the service
    list: jest.fn().mockReturnValue(payments),
    save: jest.fn() as any,
    findByKey: jest.fn() as any,
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return accounts with correct balances calculated from charges minus payments", async () => {

    const svc = new AccountsService(mockClient, mockPaymentsRepo);

    const result = await svc.listWithBalances();

    // A-0001: charges 30 - payments 15 = 15
    const a1 = result.find(r => r.id === "A-0001");
    expect(a1).toBeDefined();
    expect(a1!.balance).toBe(15);

    // A-0002: charges 0 - payments 12.345 = -12.35 (rounded to 2dp)
    const a2 = result.find(r => r.id === "A-0002");
    expect(a2).toBeDefined();
    expect(a2!.balance).toBe(-12.35);

    // A-0003: charges -40 - payments 0 = -40
    const a3 = result.find(r => r.id === "A-0003");
    expect(a3).toBeDefined();
    expect(a3!.balance).toBe(-40);
  });

  it("calls dependencies exactly once and in parallel-friendly manner", async () => {
    const svc = new AccountsService(mockClient, mockPaymentsRepo);

    await svc.listWithBalances();

    expect(mockClient.getAccounts).toHaveBeenCalledTimes(1);
    expect(mockClient.getCharges).toHaveBeenCalledTimes(1);
    expect(mockPaymentsRepo.list).toHaveBeenCalledTimes(1);
  });

  it("handles accounts with no charges and no payments (balance defaults to 0)", async () => {
    const localAccounts: Account[] = [{ id: "A-9999", type: "GAS", address: "Nowhere", volume: 1 }];
    const localClient: jest.Mocked<AccountsClient> = {
      getAccounts: jest.fn().mockResolvedValue(localAccounts),
      getCharges: jest.fn().mockResolvedValue([]),
    };
    const localRepo: any = { list: jest.fn().mockReturnValue([]) };

    const svc = new AccountsService(localClient, localRepo);
    const result = await svc.listWithBalances();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ id: "A-9999", balance: 0 });
  });
});
