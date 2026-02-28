import { Router } from "express";

import { auth } from "../middleware/auth";
import { ExpenseController } from "../controllers/expense";

const expenseController = new ExpenseController();
const expenseRouter = Router();

expenseRouter.post("/expense/create", auth, expenseController.createExpense);

expenseRouter.patch("/expense/:id", auth, expenseController.updateExpense);

expenseRouter.get("/expense/:id", auth, expenseController.getSpecificExpense);

expenseRouter.get("/expenses", auth, expenseController.getExpenseByCategory);

expenseRouter.get("/expenses/all", auth, expenseController.getExpenses);

expenseRouter.delete("/expense/:id", auth, expenseController.deleteExpense);

export default expenseRouter;
