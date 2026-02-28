import pool from "./postgres";

export async function createExpense(
  expenseName: string,
  amount: number,
  category: string,
  user_id: number
) {
  try {
    const expense = await pool.query(
      `INSERT INTO expenses(owner, expenseName, amount, category) VALUES($1, $2, $3, $4) RETURNING *`,
      [user_id, expenseName, amount, category]
    );
    // if (expense.rows.length === 0) {
    //   return "";
    // }
    return expense.rows[0];
  } catch (e) {
    console.error(`An error occurred`, e);
  }
}

export async function createUser(
  username: string,
  email: string,
  password: string
) {
  try {
    const user = await pool.query(
      `INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING *`,
      [username, email, password]
    );
    // if (user.rows.length === 0) throw new Error("Error creating user");
    return user.rows[0];
  } catch (e) {
    console.error(`An error occurred`, e);
  }
}

export async function findExpense(id: number, owner: number) {
  try {
    const expense = await pool.query(
      `SELECT * from expenses WHERE id =$1 AND owner=$2`,
      [id, owner]
    );
    // if (expense.rows.length === 0) throw new Error("Error finding expense");
    return expense.rows[0];
  } catch (e) {
    console.error(`An error occurred`, e);
  }
}

export async function findAllExpenses(owner: number) {
  try {
    const expense = await pool.query(`SELECT * from expenses WHERE owner=$1`, [
      owner,
    ]);
    // if (expense.rows.length === 0) throw new Error("No expenses found");
    return expense.rows;
  } catch (e) {
    console.error(`An error occurred`, e);
  }
}
export async function findUser(id: number) {
  try {
    const user = await pool.query(`SELECT * from users WHERE id =$1`, [id]);
    // if (user.rows.length === 0) throw new Error("Error finding user");
    return user.rows[0];
  } catch (e) {
    console.error(`An error occurred`, e);
  }
}

export async function findUserByEmail(email: string) {
  try {
    const user = await pool.query(`SELECT * from users WHERE email=$1`, [
      email,
    ]);
    // if (user.rows.length === 0) throw new Error("Error finding user");
    return user.rows[0];
  } catch (e) {
    console.error(`An error occurred`, e);
  }
}

export async function updateUser(username: string, id: number) {
  try {
    const user = await pool.query(
      `UPDATE users SET username=$1 WHERE id=$2 RETURNING *;`,
      [username, id]
    );
    if (user.rows.length === 0) throw new Error("Error finding user");
    return user.rows[0];
  } catch (e) {
    console.error(`An error occurred`, e);
    throw e;
  }
}

export async function updateSpecificExpense(
  owner: number,
  category?: string,
  expenseName?: string,
  amount?: number
) {
  try {
    const fieldsToUpdate: Record<string, any> = {};
    if (category !== undefined && category !== null)
      fieldsToUpdate.category = category;
    if (expenseName !== undefined && expenseName !== null)
      fieldsToUpdate.expense_name = expenseName;
    if (amount !== undefined && amount !== null) fieldsToUpdate.amount = amount;

    if (Object.keys(fieldsToUpdate).length === 0) {
      throw new Error("No fields provided to update");
    }

    const setClauses = Object.keys(fieldsToUpdate).map(
      (key, i) => `${key} = $${i + 1}`
    );
    const values = Object.values(fieldsToUpdate);

    values.push(owner);

    const query = `
      UPDATE expenses
      SET ${setClauses.join(", ")}
      WHERE id = $${values.length}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    // if (result.rows.length === 0) throw new Error("Expense not found");

    return result.rows[0];
  } catch (e) {
    console.error("An error occurred updating expense:", e);
    throw e;
  }
}

export async function deleteUser(id: number) {
  try {
    const user = await pool.query(
      `DELETE from users WHERE id=$1 RETURNING *;`,
      [id]
    );
    // if (user.rows.length === 0) throw new Error("Error finding user");
    return user.rows[0];
  } catch (e) {
    console.error(`An error occurred`, e);
    throw e;
  }
}

export async function deleteSpecificExpense(id: number, owner?: number) {
  try {
    const user = await pool.query(
      `DELETE from expenses WHERE id=$1 AND owner=$2 RETURNING *;`,
      [id, owner]
    );
    // if (user.rows.length === 0) throw new Error("Error finding user");
    return user.rows[0];
  } catch (e) {
    console.error(`An error occurred`, e);
    throw e;
  }
}

export async function getExpenseByCategory(category: string, owner: number) {
  try {
    const user = await pool.query(
      `SELECT * from expenses WHERE category=$1 AND owner=$2;`,
      [category, owner]
    );
    // if (user.rows.length === 0) throw new Error("Error finding user");
    return user.rows[0];
  } catch (e) {
    console.error(`An error occurred`, e);
    throw e;
  }
}
