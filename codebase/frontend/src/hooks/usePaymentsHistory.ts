import * as React from "react";
import { getPayments } from "../api/payment";
import { PaymentResponse } from "../types";

export function usePaymentsHistory() {
  const [data, setData] = React.useState<PaymentResponse[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const reload = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getPayments();
      // sort newest first
      setData([...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)));
    } catch (e: any) {
      if (e?.name !== "AbortError") setError(e?.message || "Failed to load payments");
    } finally {
      setLoading(false);
      console.log(data);
    }
  }, []);

  React.useEffect(() => {
    const cleanup = reload();
    return typeof cleanup === "function" ? cleanup : undefined;
  }, [reload]);

  return { data, loading, error, reload };
}
