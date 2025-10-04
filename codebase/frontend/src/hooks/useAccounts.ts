import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import type { Account } from "../types";
import { fetchAccounts} from "../api/accounts"

export function useAccounts(filters: { type?: string; address?: string }) {
    const [data, setData] = useState<Account[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        try { setLoading(true); setError(null); const res = await fetchAccounts(filters); setData(res); }
        catch (e: any) { setError(e.message || "Failed to load accounts"); }
        finally { setLoading(false); }
    }, [filters.type, filters.address]);

    useEffect(() => { load(); }, [load]);
    return { data, loading, error, reload: load };
}
