import { Router } from "express";
import { accountsRouter } from "./accounts.controller";

export const api = Router();
api.use("/accounts", accountsRouter);
