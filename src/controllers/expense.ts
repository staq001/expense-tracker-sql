import { Response, NextFunction } from "express";
import {
  createExpense,
  findExpense,
  findAllExpenses,
  getExpenseByCategory,
  deleteSpecificExpense,
  updateSpecificExpense,
} from "../db/reusables";
import type { AuthenticatedRequest } from "../types";

export class ExpenseController {
  async createExpense(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { expenseName, amount, category } = req.body;
      if (!expenseName || !amount) {
        res.status(400).json({
          status: 400,
          message:
            "Bad Request. Fields (expenseName, amount, category) must not be empty!",
        });
        return;
      }

      if (req.user) {
        const expense = await createExpense(
          expenseName,
          amount,
          category,
          req.user.id
        );

        res.status(201).json({
          status: 201,
          message: "Expense created successfully!",
          data: {
            expense,
          },
        });
      }
    } catch (e) {
      next(e);
    }
  }

  async updateExpense(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const { expenseName, amount, category } = req.body;
      if (Object.keys(req.body).length === 0) {
        res.status(400).json({
          status: 400,
          message:
            "Bad Request. One of Fields (expenseName, amount, category) must not be empty!",
        });
        return;
      }
      if (req.user) {
        const expense = await updateSpecificExpense(
          req.user?.id,
          category,
          expenseName,
          amount
        );

        if (!expense) {
          res.status(404).json({
            status: 404,
            message: "Expense not found.",
          });
          return;
        }

        res.status(200).json({
          status: 200,
          message: "Expense updated successfully!",
          data: {
            expense,
          },
        });
      }
    } catch (e) {
      next(e);
    }
  }

  async getSpecificExpense(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      if (req.user) {
        const expense = await findExpense(Number(id), req.user.id);
        if (!expense) {
          res.status(404).json({
            status: 404,
            message: "Expense not found",
          });
          return;
        }

        res.status(200).json({
          status: 200,
          message: "Message fetched successfully!",
          data: {
            expense,
          },
        });
      }
    } catch (e) {
      next(e);
    }
  }

  async getExpenseByCategory(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { category } = req.query;
      const categoryList = [
        "income",
        "hosuing",
        "groceries",
        "shopping",
        "entertainment",
        "others",
      ];

      if (!categoryList.includes(category as string)) {
        res.status(400).json({
          status: 400,
          message:
            "Invalid category. Valid categories include (income, housing, groceries, shopping, entertainment and others.)",
        });
      }
      if (req.user) {
        const expenses = await getExpenseByCategory(
          category as string,
          req.user.id
        );
        if (!expenses) {
          res.status(404).json({
            status: 404,
            message: "Expense not found",
          });
          return;
        }

        res.status(200).json({
          status: 200,
          messages: "Expenses fetched successfully!",
          data: {
            expenses,
          },
        });
      }
    } catch (e) {
      next(e);
    }
  }

  async getExpenses(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (req.user) {
        const expenses = await findAllExpenses(req.user.id);
        res.status(200).json({
          status: 200,
          message: "Expenses fetched successfully!",
          data: {
            expenses,
          },
        });
      }
    } catch (e) {
      next(e);
    }
  }

  async deleteExpense(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      if (req.user) {
        const expense = await deleteSpecificExpense(Number(id), req.user.id);
        if (!expense) {
          res.status(404).json({
            status: 404,
            message: "Expense not found",
          });
          return;
        }

        res.status(200).json({
          status: 200,
          message: "Expense deleted successfully",
        });
      }
    } catch (e) {
      next(e);
    }
  }
}
