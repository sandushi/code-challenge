import * as React from "react";
import { Box, Alert, Stack, Collapse } from "@mui/material";
import { useAccounts } from "../hooks/useAccounts";
import { useState } from "react";
import { AccountCard } from "../components/AccountCard";
import { Account } from "../types";
import PaymentDialog from "../components/PaymentDialog";
import { AccountsToolbar } from "../components/AccountsSearchBar";


export default function AccountsPage() {
    
    const [type, setType] = useState<string>("all");
    const [address, setAddress] = useState<string>("");
    const { data, loading, error, reload } = useAccounts({ type, address });
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState<Account | null>(null);   
    const [paymentSuccess, setPaymentSuccess] =  useState(false);
    const onPay = (a: Account) => { setActive(a); setOpen(true); };
    const onPaid = () => { reload(); };
    return (
        <Box sx={{ maxWidth: 1100, mx: "auto", px: 2, py: 3 }}>
            <AccountsToolbar
                type={type}
                onType={setType}
                address={address}
                onAddress={setAddress}
            />
            {paymentSuccess && (
                <Alert
                severity="success"
                onClose={() => setPaymentSuccess(false)}
                variant="filled"
                sx={{ my: 2 }}
                >
                Payment successful!
                </Alert>
            )}
            <Collapse in={!!error}>
                {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
            </Collapse>
            <Stack spacing={3} sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
                {!loading && data.map((a) => ( <AccountCard key={a.id} account={a} onPay={onPay}/>))}
            </Stack>
            <PaymentDialog open={open} onClose={() => setOpen(false)} account={active} onPaid={onPaid} setPaymentSuccess={setPaymentSuccess}/>
        </Box>
  
    );
}