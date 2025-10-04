import { Router } from "express";
import { paymentsRepo } from "../repositories/singletons/paymentsRepo";
import { PaymentsService } from "../services/payment.service";
import { PaymentApi } from "../clients/payment.client";
import { AccountsApi } from "../clients/accounts.client";

export const paymentsRouter = Router();


const service = new PaymentsService(PaymentApi, paymentsRepo, AccountsApi);

paymentsRouter.post("/", async (req, res, next) => {
  try {
    const result = await service.pay(req.body);
    res.status(201).json(result);
  } catch (e) { next(e); }
});

paymentsRouter.get("/", async (_req, res, next) => {
  try {
    const history = await service.getPaymentHistory();
    res.json(history);
  } catch (e) { next(e); }
});
