import * as React from "react";
import { Stack, FormControl, Select, MenuItem, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

type Props = {
  type: string;
  onType: (v: string) => void;
  address: string;
  onAddress: (v: string) => void;
};

export function AccountsToolbar({ type, onType, address, onAddress }: Props) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      alignItems={{ sm: "center" }}
      justifyContent="space-between"
    >
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <Select value={type} onChange={(e) => onType(e.target.value)} displayEmpty>
          <MenuItem value="all">All types</MenuItem>
          <MenuItem value="electricity">Electricity</MenuItem>
          <MenuItem value="gas">Gas</MenuItem>
        </Select>
      </FormControl>

      <TextField
        size="small"
        fullWidth
        placeholder="Search by address…"
        value={address}
        onChange={(e) => onAddress(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
        sx={{ maxWidth: 520 }}
      />
    </Stack>
  );
}
