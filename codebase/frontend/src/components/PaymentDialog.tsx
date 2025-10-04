import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert, Collapse, Stack } from '@mui/material';
import { Account, PaymentResponse } from '../types';
import { useEffect } from 'react';
import { usePayments } from '../hooks/usePayments';

export default function PaymentDialog({open, onClose,  account, onPaid, setPaymentSuccess}: { open: boolean; onClose: () => void; account: Account | null; 
    onPaid: () => void; setPaymentSuccess: (s: boolean) => void; }) {

    const [amount, setAmount] = React.useState<number>(0);
    const [cardNumber, setCardNumber] = React.useState("");
    const [expiry, setExpiry] = React.useState("");
    const [cvv, setCvv] = React.useState("");
    const canPay = Number(amount) > 0 && cardNumber && expiry && cvv;
    const { pay, paymentError, result, reset } = usePayments();

    const formatCardNumber = (value: string) => {
        return value
        .replace(/\D/g, "")
        .slice(0, 16) // limit to 16 digits
        .replace(/(.{4})/g, "$1 ")
        .trim();
    };

    // Limit cvv length mamixum for 4 digits
    const limitCvv = (value: string) => value.replace(/\D/g, "").slice(0, 4);
    
    useEffect(() => {
        if (open) {
            reset();
            const balance = account?.balance ?? 0; 
            setAmount(Math.max(0, balance));
            setCardNumber("");
            setExpiry("");
            setCvv("");
        }
    }, [account, open]);

    const handlePay = async () => {
        if (!account) return;
        try {
            await pay({
                accountId: account.id,
                amount: amount,
                card: {
                    number: cardNumber,
                    expiry: expiry,
                    cvv: cvv,
                },
            });
            setPaymentSuccess(true);
            onPaid();
            onClose();
          
        } catch (err) {
            // error is already handled by your hook (paymentError)
            console.error("Payment failed", err);
        }
    };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Make a payment</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
            <Collapse in={!!paymentError}>
            {paymentError && <Alert severity="error" sx={{ mb: 2 }}>{paymentError.message}</Alert>}
          </Collapse>
            <DialogContentText>
                How much would you like to pay?
            </DialogContentText>
            <TextField
                autoFocus
                required
                margin="dense"
                id="name"
                name="amount"
                placeholder='Amount'
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                fullWidth
            />
            <DialogContentText>
                How would you like to pay?
            </DialogContentText>
            <TextField
                autoFocus
                required
                margin="dense"
                id="card-number"
                name="card-number"
                placeholder='card number'
                type="string"
                value={formatCardNumber(cardNumber)}
                onChange={(e) => {
                    formatCardNumber(e.target.value)
                    setCardNumber(e.target.value)
                    }
                }
                fullWidth
            />
            
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <TextField 
                    fullWidth 
                    placeholder="Expiry ( MM/YY )" 
                    name="expiry" 
                    value={expiry} 
                    onChange={(e) => setExpiry(e.target.value)}
                />
                <TextField
                    fullWidth
                    placeholder="CVV"
                    name="cvv"
                    value={cvv} 
                    onChange={(e) => setCvv(limitCvv(e.target.value))}
                />
            </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant='contained' onClick={handlePay} disabled= {!canPay}>
            Pay
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
