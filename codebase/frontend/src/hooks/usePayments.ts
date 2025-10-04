import * as React from "react";
import { PaymentRequest, PaymentResponse } from "../types";
import { createPayment } from "../api/payment";
import { useCallback, useEffect, useState } from "react";
import { ApiError } from "../api/ApiError";


export function usePayments() {
    
    const [loading, setLoading] = useState(false);
    const [paymentError, setPaymentError] = useState<ApiError | null>(null);
    const [result, setResult] = useState<PaymentResponse | null>(null);
    const pay = useCallback(async (payload: PaymentRequest) => {
        setLoading(true);
        setPaymentError(null);
        setResult(null);

        try {
            const payment = await createPayment(payload);
            setResult(payment);
            return payment;
        } catch (err: any) {
            setPaymentError(err instanceof ApiError ? err : new ApiError(err?.message || "Payment failed"));
            throw err;
        } finally {
            setLoading(false);
        }
  }, []);

  const reset = useCallback(() => {
    setPaymentError(null);
    setResult(null);
  }, []);

  return { pay, loading, paymentError, result, reset };
}