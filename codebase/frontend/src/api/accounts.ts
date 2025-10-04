import type { Account } from "../types";
import { API_BASE_URL } from "../config";

export async function fetchAccounts(params?: { type?: string; address?: string }): Promise<Account[]> {
  try {

    const res = await fetch(`${API_BASE_URL}/accounts`);
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data: Account[] = await res.json();

    let filtered = data;

    // Filter by the type
    if (params?.type && params.type.toLowerCase() !== "all") {
      filtered = filtered.filter(acc => acc.type.toLowerCase() === params.type!.toLowerCase());
    }

    // Filter from the address
    if (params?.address) {
      const qLower = params.address.toLowerCase();
      filtered = filtered.filter(acc => acc.address.toLowerCase().includes(qLower));
    }

    return filtered;
  } catch (err: any) {
    console.error("Failed to fetch accounts", err);
    throw err;
  }
}
