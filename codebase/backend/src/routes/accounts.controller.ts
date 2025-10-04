import { Router } from "express";
import { AccountsService } from "../services/accounts.service";
import { AccountsApi } from "../clients/accounts.client";
import { paymentsRepo } from "../repositories/singletons/paymentsRepo";

export const accountsRouter = Router();
const service = new AccountsService(AccountsApi, paymentsRepo );

accountsRouter.get("/", async (_req, res, next) => {
  try {
    const accounts = await service.listWithBalances();
    res.json(accounts);
  } catch (err:any) {
     next(err);
  }
});

