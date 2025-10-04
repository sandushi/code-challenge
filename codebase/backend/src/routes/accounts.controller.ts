import { Router } from "express";
import { AccountsService } from "../services/accounts.service";
import { AccountsApi } from "../clients/accounts.client";

export const accountsRouter = Router();
const service = new AccountsService(AccountsApi );

accountsRouter.get("/", async (_req, res, next) => {
  try {
    const accounts = await service.listWithBalances();
    res.json(accounts);
  } catch (err:any) {
     next(err);
  }
});

