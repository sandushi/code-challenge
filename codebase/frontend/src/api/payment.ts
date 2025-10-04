// Frontend API class for Payments

import { PaymentRequest, PaymentResponse } from "../types";
import { ApiError } from "./ApiError";
import { API_BASE_URL } from "../config";

export async function createPayment(payload: PaymentRequest): Promise<PaymentResponse> {
    const res = await fetch(`${API_BASE_URL}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // optional: surface backend error message
    if (res.ok) {
     return res.json() as Promise<PaymentResponse>;
    }

    let parsed: any = null;
    try {
        parsed = await res.json();
    } catch {
        // not JSON
    }
    if (parsed && (parsed.error.message || parsed.error.code || parsed.statusCode)) {
        throw new ApiError(parsed.error.message || "Payment failed", {
        status: parsed.error.status ?? res.status,
        details: parsed.error,
        });
    } else {
        const text = await res.text().catch(() => "");
        throw new ApiError(text || "Payment failed", { status: res.status });
    }
    
}

export async function getPayments(): Promise<PaymentResponse[]> {
  const res = await fetch(`${API_BASE_URL}/payments`);
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new ApiError(msg || `GET /payments failed (${res.status})`);
  }
  return res.json() as Promise<PaymentResponse[]>;
}
