export type EnergyType = "ELECTRICITY" | "GAS";

export interface Account {
  id: string;
  type: EnergyType;
  address: string;
  meterNumber?: string;
  volume?: number;
}

export interface AccountWithBalance extends Account {
  balance: number;
}