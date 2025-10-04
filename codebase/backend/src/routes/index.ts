import { Router } from "express";
import { accountsRouter } from "./accounts.controller";
import { paymentsRouter } from "./payment.controller";

export const api = Router();
api.use("/accounts", accountsRouter);
api.use("/payments", paymentsRouter);
