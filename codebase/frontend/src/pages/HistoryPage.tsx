import * as React from "react";
import {
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Stack, TextField, InputAdornment, CircularProgress, Alert, Button
} from "@mui/material";
import { usePaymentsHistory } from "../hooks/usePaymentsHistory";
import { PaymentResponse } from "../types";

const formatAmount = (n: number) =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD" });

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export default function HistoryPage() {
  const { data, loading, error } = usePaymentsHistory();


  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", px: 2, py: 3 }}>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
        Payment Details
      </Typography>

      {/* Content states */}
      {loading && <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!loading && !error && data.length === 0 && (
        <Alert severity="info">No payments found.</Alert>
      )}

      {/* Table */}
      {!loading && !error && data.length > 0 && (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Account ID</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>{formatDate(p.createdAt)}</TableCell>
                  <TableCell>{p.accountId}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    {formatAmount(p.amount)}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "monospace" }}>{p.id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
