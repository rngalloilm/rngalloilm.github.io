const db = require('./DBConnection');

module.exports = {
  createExpense: async (userId, date, amount, description, categoryId, frequency) => {
    if (categoryId === undefined || categoryId === null) {
      throw new Error("Category ID is required for expenses");
    }
    try {
      const result = await db.query(
        'INSERT INTO transaction (tra_usr_id, tra_date, tra_amount, tra_description, tra_category_id, tra_type, tra_recurring_frequency) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, date, amount, description, categoryId, 'expense', frequency]
      );

      if (!result.insertId) {
        throw new Error("Failed to creaet expense record.");
      }
      const expenseRecords = await db.query(
        'SELECT * FROM transaction WHERE tra_id = ?', [result.insertId]
      );
      if (!expenseRecords || expenseRecords === 0) {
        throw new Error("Expense record not found after insertion.");
      }
      return expenseRecords[0];
    }
    catch (err) {
      console.error("Error in createExpense:", err);
      throw new Error("Failed to create Expense record due to database error.");
    }
  },
  getExpensesByUserId: async (userId) => {
    try {
      const expenses = await db.query(
        `SELECT t.*, c.cat_name
          FROM transaction t
          LEFT JOIN category c ON t.tra_category_id = c.cat_id
          WHERE t.tra_usr_id = ? AND t.tra_type = ?
          ORDER BY t.tra_date DESC, t.tra_id DESC`,
        [userId, 'expense']
      );
      return expenses;
    } catch (err) {
      console.error("Failed to get expenses");
      throw new Error("Failed to retrieve expense records");
    }
  },
  deleteExpenseByIdAndUserId: async (expenseId, userId) => {
    try {
      const result = await db.query(
          'DELETE FROM transaction WHERE tra_id = ? AND tra_usr_id = ? AND tra_type = ?',
          [expenseId, userId, 'expense']
      );
      if (result.affectedRows === 0) {
          throw new Error("Expense record not found for this user or already deleted.");
      }
      return { message: "Expense record deleted successfully." };
    } catch (err) {
      console.error("Failed to delete expense");
      throw new Error("Failed to delete expense record.");
    }
  },
  getExpenseByIdAndUserId: async (expenseId, userId) => {
    try {
        const [expenseRecord] = await db.query(
            `SELECT t.*, c.cat_name
              FROM transaction t
              LEFT JOIN category c ON t.tra_category_id = c.cat_id
              WHERE t.tra_id = ? AND t.tra_usr_id = ? AND t.tra_type = ?`,
              [expenseId, userId, 'expense']
        );
        if (!expenseRecord) {
            throw new Error("Expense record not found for this user.");
        }
        return expenseRecord;
    } catch (err) {
        console.error("Failed to get expense.");
        throw new Error("Failed to retrieve expense record.");
    }
  },
  updateExpenseByIdAndUserId: async (expenseId, userId, data) => {
    const {date, amount, description, categoryId, frequency} = data;
    if (!date || amount === undefined || amount === null || categoryId === undefined || categoryId === null) {
      throw new Error("Date, amount, and categoryId are required for update.");
    }
    try {
      const result = await db.query(
        'UPDATE transaction SET tra_date = ?, tra_amount = ?, tra_description = ?, tra_category_id = ?, tra_recurring_frequency = ? WHERE tra_id = ? AND tra_usr_id = ? AND tra_type = ?',
        [date, amount, description, categoryId, frequency || 'none', expenseId, userId, 'expense']
      );

      if (result.affectedRows === 0) {
        throw new Error("Expense record not found for this user or no changes needed.");
      }

      const updatedRecord = await module.exports.getExpenseByIdAndUserId(expenseId, userId);
      return updatedRecord;

    }
    catch (error) {
      console.error("Error in updating expense record.");
      throw new Error("Failed to update expense record.");
    }
  }
}