const db = require('./DBConnection');

module.exports = {
  createIncome: async (userId, date, amount, description, frequency) => {
    try {
      // Insert the new income record into the transaction table
      const result = await db.query(
        'INSERT INTO transaction (tra_usr_id, tra_date, tra_amount, tra_description, tra_type, tra_recurring_frequency) VALUES (?, ?, ?, ?, ?, ?)',                                                                                
        [userId, date, amount, description, 'income', frequency]
      );

      // Check if an insertId was returned, indicating success
      if (!result.insertId) {
        throw new Error("Failed to create income record.");
      }

      // Retrieve and return the newly created income record
      const incomeRecords = await db.query(
        'SELECT * FROM transaction WHERE tra_id = ?',
        [result.insertId]
      );

      if (!incomeRecords || incomeRecords.length === 0) {
        throw new Error("Income record not found after insertion.");
      }

      return incomeRecords[0];
    } catch (err) {
      console.error("Error in createIncome:", err);
      throw new Error("Failed to create income record due to a database error.");
    }
  },
  getIncomeByUserId: async (userId) => {
    try {
      const incomes = await db.query(
        'SELECT * FROM transaction WHERE tra_usr_id = ? AND tra_type = ? ORDER BY tra_date DESC, tra_id DESC',
        [userId, 'income']
      );
      return incomes;
    }
    catch(error) {
      console.error("Error in getting user incomes.");
      throw new Error("Failed to retrieve income records.");
    }
  },
  deleteIncome: async (incomeId, userId) => {
    try {
      const result = await db.query(
        'DELETE FROM transaction WHERE tra_id = ? AND tra_usr_id = ? AND tra_type = ?',
        [incomeId, userId, 'income']
      );
      if (result.affectedRows === 0) {
        throw new Error("Income record not found for this user.");
      }
      return {message: "Income record deleted successfully."};
    }
    catch(error) {
      console.error("Error in deleting income.");
      throw new Error("Failed to delete income record.");
    }
  },
  getIncomeByIdAndUserId: async (incomeId, userId) => {
    try {
      const [incomeRecord] = await db.query(
        'SELECT * FROM transaction WHERE tra_id = ? AND tra_usr_id = ? AND tra_type = ?',
        [incomeId, userId, 'income']
      );
      if (!incomeRecord) {
        throw new Error("Income record not found.")
      }
      return incomeRecord;
    }
    catch(error) {
      console.error("Error in getting income by id and user id.");
      throw new Error("Income record not found");
    }
  },
  updateIncomeByIdAndUserId: async (incomeId, userId, data) => {
    const {date, amount, description, frequency} = data;
    if (!date || amount === undefined || amount === null) {
      throw new Error("Date and amount are required for update.");
    }

    try {
      const result = await db.query(
        'UPDATE transaction SET tra_date = ?, tra_amount = ?, tra_description = ?, tra_recurring_frequency = ? WHERE tra_id = ? AND tra_usr_id = ? AND tra_type = ?',
        [date, amount, description, frequency, incomeId, userId, 'income']
      );
      if (result.affectedRows === 0) {
        throw new Error("Income record was not found.");
      }
      
      const updatedRecord = await module.exports.getIncomeByIdAndUserId(incomeId, userId);
      return updatedRecord;
    }
    catch(error) {
      console.error("Error in updating Income record.");
      throw new Error("Failed to update income record.");
    }
  }
};
