import * as React from "react";
import { Card, CardContent, Chip, Stack, Typography, Button, Avatar, Box, Link } from "@mui/material";
import { Account, EnergyType } from "../types";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";


const formatAmount = (n: number) => n.toLocaleString("en-AU", { style: "currency", currency: "AUD" });
const iconByType: Record<EnergyType, JSX.Element> = {
        ELECTRICITY: <ElectricBoltIcon fontSize="large" />,
        GAS: <LocalFireDepartmentIcon fontSize="large" />
    };
const balanceColor = (bal: number) => (bal > 0 ? "success.main" : bal < 0 ? "error.main" : "text.secondary");


export function AccountCard({ account, onPay }: { account: Account; onPay: (a: Account) => void }) {
    return (
        <Card variant="outlined" sx={{ borderRadius: 4}}>
        <CardContent>
            <Stack direction="row" spacing={2} alignItems="flex-start">
            <Avatar
                sx={{
                width: 64,
                height: 64,
                border: "2px solid",
                borderColor: "divider",
                boxShadow: 0
                }}
            >
                {iconByType[account.type]}
            </Avatar>

            <Box flex={1}>
                <Typography
                variant="h4"
                sx={{ fontWeight: 700, lineHeight: 1.1, mb: 0.5 }}
                >
                {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                </Typography>

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {account.id}
                </Typography>

                <Typography variant="body1" color="text.secondary">
                    {account.address}
                </Typography>

                {/* Big spacer like the mock */}
                <Box sx={{ py: { xs: 2, sm: 3 } }} />

                <Stack direction="row" alignItems="center">
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Account Balance
                </Typography>
                <Box flex={1} />
                <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: balanceColor(account.balance) }}
                > 
                {formatAmount(account.balance)}
                </Typography>
                </Stack>
                <Button variant="contained" onClick={() => onPay(account)}>Make Payment</Button>
            </Box>
            </Stack>
        </CardContent>
        </Card>
    );
}