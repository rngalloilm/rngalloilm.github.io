const express = require('express');
const cookieParser = require('cookie-parser');
const UserDAO = require('./db/UserDAO');
const ExpenseDAO = require('./db/ExpenseDAO');
const CategoryDAO = require('./db/CategoryDAO');
const User = require('./db/models/User');
const db = require('./db/DBConnection');
const IncomeDAO = require('./db/IncomeDAO');

const router = express.Router();

router.use(cookieParser());
router.use(express.json());

const { TokenMiddleware, generateToken, removeToken } = require('../middleware/TokenMiddleware');

/** AUTHENTICATION & USER MANAGEMENT */

// Register a new user
router.post('/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, username, password, repeatPassword } = req.body;

    // --- Basic Backend Validation ---
    if (!firstName || !lastName || !username || !password || !repeatPassword) {
      return res.status(400).json({ error: "Missing required fields." });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long." });
    }
    if (password !== repeatPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    // --- Check if username already exists ---
    const existingUser = await UserDAO.getUserByUsername(username);
    if (existingUser) {
      // Conflict for existing resource
      return res.status(409).json({ error: "Username already taken." });
    }

    // --- Hash Password ---
    const { salt, hash } = await User.hashPassword(password);

    // --- Create User in DB ---
    const newUser = await UserDAO.createUser(firstName, lastName, username, salt, hash);
    console.log("New User: ", newUser);

    // --- Send Success Response ---
    // 201 Created for successful resource creation
    // Send back some user info
    res.status(201).json({
      message: "User registered successfully!",
      user: { // Non-sensitive info
        id: newUser.id,
        username: newUser.username,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      }
    });

  } catch (error) {
    console.error("Registration Error:", error.message);

    // Use 409 Conflict
    if (error.message === "Username already exists.") {
      return res.status(409).json({ error: error.message });
    }
    
    res.status(500).json({ error: "An unexpected error occurred during registration." });
  }
  // res.json('User registered');
});

// Authenticate user and return token
router.post('/auth/login', async (req, res) => {
  try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
      }

      // DAO should throw an error if user not found or password invalid
      const user = await UserDAO.getUserByCredentials(username, password);

      // If validation passed, user object is returned
      generateToken(req, res, user.toJSON());

      res.status(200).json({
        message: "Login successful",
        user: user.toJSON(),
        token: req.cookies
       });

  } catch (error) {
      // Catch errors from DAO
      console.error("Login Error:", error.message);
      // 401 Unauthorized for login failures
      res.status(401).json({ error: error.message || "Authentication failed." });
  }
});

// Logout user (token invalidation is typically handled client-side)
router.post('/auth/logout', (req, res) => {
  removeToken(req, res);
  res.status(200).json({ message: 'User logged out successfully.' });
});

// Get current authenticated user (protected route)
router.get('/auth/current', TokenMiddleware, (req, res) => {
  res.json(req.user);
});

/** USER DASHBOARD */

// Get a user's financial summary
router.get('/dashboard', TokenMiddleware, (req, res) => {
  res.json('User\'s financial summary');
});

// Get a users monthly spending 
router.get('/dashboard/spending', TokenMiddleware, async(req, res) => {
  const user = req.user;
  try {
    const monthlySpending = await UserDAO.getMonthlySpending(user.username);
    res.json({
      message: "Monthly spending retrieved successfully",
      data: monthlySpending
    });
  }
  catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to retrieve monthly spending."});
  }
});

// Get a user's unallocated cahs
router.get('/dashboard/unallocated', TokenMiddleware, async (req, res) => {
  const user = req.user;
  try {
    const unallocatedCash = await UserDAO.getFreeCash(user.username);
    res.json({
      message: "Unallocated cash retrieved successfully",
      data: unallocatedCash
    });
  }
  catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to retrieve unallocated cash."});
  }
});

/** INCOME MANAGEMENT */

// Retrieve all income entries
router.get('/income', TokenMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const incomes = await IncomeDAO.getIncomeByUserId(userId);
    res.status(200).json(incomes);
  }
  catch(error) {
    console.error("Error fetching user's income.");
    res.status(500).json({error: 'Failed to retrieve income records.'});
  } 
});

// Add new income entry
router.post('/income', TokenMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { date, amount, description, frequency } = req.body;
    const newIncome = await IncomeDAO.createIncome(user.id, date, amount, description, frequency);
    res.json({
      message: "New income entry added.",
      data: newIncome
    });
  }
  catch (error) {
    console.error("Error creating income entry:", error.message);
    res.status(500).json({ error: "Failed to add new income entry."});
  }
});

// Retrieve a specific income entry
router.get('/income/:incomeId', TokenMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const incomeId = parseInt(req.params.incomeId, 10);
    if (isNaN(incomeId)) {
      return res.status(400).json({error: "Invalid income ID format."});
    }
    const income = await IncomeDAO.getIncomeByIdAndUserId(incomeId, userId);
    res.status(200).json(income);
  }
  catch(error) {
    console.error("Could not retrieve income.");
    res.status(500).json({error: "Failed to retrieve income record."});
  }
});

// Update an income entry
router.put('/income/:incomeId', TokenMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const incomeId = parseInt(req.params.incomeId, 10);
    if (isNaN(incomeId)) {
      return res.status(400).json({error: "Invalid income ID format."});
    }
    const updateData = req.body;
    if (!updateData.date || updateData.amount === undefined || updateData.amount === null) {
      return res.status(400).json({ error: "Missing required fields (date, amount)." });
    }

    const amount = parseFloat(updateData.amount);
    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount provided." });
    }

    const updatedIncome = await IncomeDAO.updateIncomeByIdAndUserId(incomeId, userId, updateData);
    res.status(200).json(updatedIncome);
  }
  catch(error) {
    console.error("Could not update income record.");
    res.status(500).json({error: error.message});
  }
});

// Delete an income entry
router.delete('/income/:incomeId', TokenMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const incomeId = parseInt(req.params.incomeId, 10);
    if (isNaN(incomeId)) {
      res.status(400).json({error: "Invalid income ID format."});
    }
    const result = await IncomeDAO.deleteIncome(incomeId, userId);
    res.status(200).json(result);
  }
  catch(error) {
    console.error("Error deleting income.");
    res.status(500).json({error: "Failed to delete income record."});
  }
});

/** EXPENSE MANAGEMENT */

// Retrieve all expenses
router.get('/expenses', TokenMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const expenses = await ExpenseDAO.getExpensesByUserId(userId);
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error fetching user's expenses:");
    res.status(500).json({ error: "Failed to retrieve expense records." });
  }
});

// Add a new expense
router.post('/expenses', TokenMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const {date, amount, description, categoryId, frequency} = req.body;

    if (!date || !amount || categoryId === undefined || categoryId === null) {
      return res.status(400).json({error: 'Missing required fields (date, amount, categoryId).'});
    }
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({error: 'Invalid amount.'});
    }

    const newExpense = await ExpenseDAO.createExpense(
      user.id, date, amount, description, categoryId, frequency || 'none'
    );

    res.status(201).json({
      message: "New expense entry added.",
      data: newExpense
    });
  }
  catch (err) {
    console.error('Error creating expnese entry:', err.message);
    if (err.message === "Invalid Category ID provided.") {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Failed to add new expense entry." });
  }
});

// Retrieve a specific expense
router.get('/expenses/:expenseId', TokenMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const expenseId = parseInt(req.params.expenseId, 10);
     if (isNaN(expenseId)) {
        return res.status(400).json({ error: "Invalid expense ID format." });
     }
    const expense = await ExpenseDAO.getExpenseByIdAndUserId(expenseId, userId);
    res.status(200).json(expense);
  } catch (error) {
    console.error("Error fetching specific expense.");
    res.status(500).json({ error: "Failed to retrieve expense record." });
  }
});

// Update an expense 
router.put('/expenses/:expenseId', TokenMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const expenseId = parseInt(req.params.expenseId);
    if (isNaN(expenseId)) {
      return res.status(400).json({ error: "Invalid expense ID format." });
    }

    const updateData = req.body;

    if (!updateData.date || updateData.amount === undefined || updateData.amount === null || updateData.categoryId === undefined || updateData.categoryId === null) {
      return res.status(400).json({ error: "Missing required fields (date, amount, categoryId)." });
    }
    const amount = parseFloat(updateData.amount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount provided." });
    }

    const updatedExpense = await ExpenseDAO.updateExpenseByIdAndUserId(expenseId, userId, updateData);
    return res.status(200).json(updatedExpense);
  }
  catch(error) {
    console.error("Error updating expense record");
    res.status(500).json({error: 'Could not update expense record.'});
  }
});

// Delete an expense
router.delete('/expenses/:expenseId', TokenMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const expenseId = parseInt(req.params.expenseId, 10);
     if (isNaN(expenseId)) {
        return res.status(400).json({ error: "Invalid expense ID format." });
     }
    const result = await ExpenseDAO.deleteExpenseByIdAndUserId(expenseId, userId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error deleting expense:", error.message);
    res.status(500).json({ error: "Failed to delete expense record." });
  }
});

/** Expense Categories */

// Get all categories
router.get('/categories', TokenMiddleware, async (req, res) => {
  try {
    const categories = await CategoryDAO.getAllCategories();
    res.status(200).json(categories);
  }
  catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).json({error: 'Failed to retrieve categories.'});
  }
});

// Add a new category
router.post('/categories', TokenMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({error: 'Category name is required.'});
    }
    const newCategory = await CategoryDAO.createCategory(name);
    res.status(200).json(newCategory);
  }
  catch (error) {
    console.error("Error adding category:", error.message);
    if (error.message.includes("already exists")) {
      return res.status(409).json({ error: error.message }); // 409 Conflict for duplicates
    }
     if (error.message === "Category name cannot be empty.") {
         return res.status(400).json({ error: error.message });
     }
    res.status(500).json({ error: "Failed to add new category." });
  }
});

// Update category name
router.put('/categories/:categoryId', TokenMiddleware, (req, res) => {
  res.json("Category updated");
});

// Delete a category
router.delete('/categories/:categoryId', TokenMiddleware, (req, res) => {
  res.json("Category deleted");
});

/** Calender & Due Dates (future expenses) */

// Retrieve all upcoming due dates
router.get('/calender', TokenMiddleware, (req, res) => {
  res.json("Get all due dates");
});

// Add a new due date
router.post('/calender', TokenMiddleware, (req, res) => {
  res.json("Added new due date");
});

// Update a due date
router.put('/calender/:dueId', TokenMiddleware, (req, res) => {
  res.json("Updated due date");
});

// Delete a due date
router.all('/calender/:dueId', TokenMiddleware, (req, res) => {
  res.json("Deleted due date");
});

/** Reports and Analytics */

// Get an overview of income vs expenses
router.get('/reports/overview', TokenMiddleware, async (req, res) => {
  const userId = req.user.id;
  const now = new Date();
  // Get the start and end date of the current month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const startDate = startOfMonth.toISOString().split('T')[0];
  const endDate = endOfMonth.toISOString().split('T')[0];

  try {
    const query = `
      SELECT c.cat_name, IFNULL(SUM(t.tra_amount), 0) AS total
      FROM category c
      LEFT JOIN transaction t 
        ON c.cat_id = t.tra_category_id 
        AND t.tra_usr_id = ? 
        AND t.tra_type = 'expense'
        AND t.tra_date BETWEEN ? AND ?
      GROUP BY c.cat_id, c.cat_name;
    `;
    const rows = await db.query(query, [userId, startDate, endDate]);
    res.json(rows);
  } catch (err) {
    console.error("Error in /reports/overview:", err.message);
    res.status(500).json({ error: "Error fetching report data" });
  }
});

// Get expenses breakdown by category
router.get('/reports/category/:categoryId', TokenMiddleware, (req, res) => {
  res.json("Get expenses by category");
});

// Get spending trends over time
router.get('/reports/trends', TokenMiddleware, (req, res) => {
  res.json("Spending trends over time");
});

/** NOTIFICATIONS */

// Subscribe to budget notifications
router.post('/notifications/subsribe', TokenMiddleware, (req, res) => {
  res.json("Suscribed to budget notifications");
});

// Get active notifications
router.get('/notifications', TokenMiddleware, (req, res) => {
  res.json("Active notifications");
});

// Unsubscribe from notifications
router.delete('/notifications/:notifId', TokenMiddleware, (req, res) => {
  res.json("Unsribed from notifications");
});

/** CALENDAR */

// Get all events
router.get('/calendar/events', TokenMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    // 1. Define the Time Window
    const now = new Date();
    const windowStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const windowEnd = new Date(new Date(now.getFullYear(), now.getMonth() + 3, 1).getTime() - 1);

    // 2. Fetch ALL base transactions
    const query = `
      SELECT
        t.tra_id, t.tra_date, t.tra_amount, t.tra_type, t.tra_description,
        t.tra_recurring_frequency, c.cat_name
      FROM transaction t
      LEFT JOIN category c ON t.tra_category_id = c.cat_id
      WHERE t.tra_usr_id = ?
      ORDER BY t.tra_date ASC;
    `;
    const allTransactions = await db.query(query, [userId]);

    const calendarEvents = [];

    // 3. Process each transaction
    allTransactions.forEach(tx => {
      const originalDate = new Date(tx.tra_date);
      originalDate.setUTCHours(0, 0, 0, 0);
      const frequency = tx.tra_recurring_frequency;

      const createEvent = (currentDate) => {
        let title = '';
        let color = '';
        const dateStr = currentDate.toISOString().split('T')[0];

        if (tx.tra_type === 'income') {
          title = `Income: +$${parseFloat(tx.tra_amount).toFixed(2)}`;
          if (tx.tra_description) title += ` (${tx.tra_description})`;
          color = 'green';
        } else if (tx.tra_type === 'expense') {
          title = `Expense: -$${parseFloat(tx.tra_amount).toFixed(2)}`;
          const details = [tx.cat_name, tx.tra_description].filter(Boolean).join(' - ');
          color = 'darkred';
        }

        return {
          id: `${tx.tra_id}-${dateStr}`,
          title: title,
          start: dateStr,
          allDay: true,
          backgroundColor: color,
          borderColor: color,
          extendedProps: {
              originalTransactionId: tx.tra_id
          }
        };
      };

      // --- Handle Non-Recurring / Weekly / Monthly ---
      if (frequency === 'none') {
        if (originalDate >= windowStart && originalDate <= windowEnd) {
          calendarEvents.push(createEvent(originalDate));
        }
      }
      else if (frequency === 'weekly') {
        let currentDate = new Date(originalDate.getTime());
        currentDate.setUTCHours(0,0,0,0);
        while (currentDate <= windowEnd) {
          if (currentDate >= windowStart) {
            calendarEvents.push(createEvent(currentDate));
          }
          currentDate.setUTCDate(currentDate.getUTCDate() + 7);
        }
      }
      else if (frequency === 'monthly') {
        let currentDate = new Date(originalDate.getTime());
        currentDate.setUTCHours(0,0,0,0);
        while (currentDate <= windowEnd) {
          if (currentDate >= windowStart) {
             calendarEvents.push(createEvent(currentDate));
          }
          if (currentDate > windowEnd) break;
          currentDate.setUTCMonth(currentDate.getUTCMonth() + 1);
          if (isNaN(currentDate.getTime())) break;
        }
      }
      // --- End Recurring Logic ---

    });

    res.json(calendarEvents);

  } catch (error) {
    console.error("Error fetching calendar events:", error);
    res.status(500).json({ error: "Failed to retrieve calendar events." });
  }
});

// Add a new event
router.post('/calendar/events', TokenMiddleware, (req, res) => {
  const newEvent = { id: events.length + 1, ...req.body };
  events.push(newEvent);
  res.status(201).json(newEvent);
});

// Update an event
router.put('/calendar/events/:id', TokenMiddleware, (req, res) => {
  const { id } = req.params;
  const index = events.findIndex(event => event.id === parseInt(id));

  if (index !== -1) {
    events[index] = { ...events[index], ...req.body };
    res.json(events[index]);
  } else {
    res.status(404).json({ message: "Event not found" });
  }
});

// Delete an event
router.delete('/calendar/events/:id', TokenMiddleware, (req, res) => {
  const { id } = req.params;
  events = events.filter(event => event.id !== parseInt(id));
  res.json({ message: "Event deleted" });
});

module.exports = router;