const db = require('./DBConnection');

module.exports = {
  getAllCategories: async () => {
    try {
      const categories = await db.query('SELECT cat_id, cat_name FROM category ORDER BY cat_name');
      return categories;
    } catch (err) {
      console.error("Error in getAllCategories:", err);
      throw new Error("Failed to retrieve categories due to a database error.");
    }
  },
  createCategory: async (categoryName) => {
    if (!categoryName || typeof categoryName !== 'string' || categoryName.trim().length === 0) {
      throw new Error("Category name cannot be empty.");
    }
    const trimmedName = categoryName.trim();

    try {
      const result = await db.query(
        'INSERT INTO category (cat_name) VALUES (?)',
        [trimmedName]
      );

      if (!result.insertId) {
        throw new Error("Failed to create category record, insertId not returned.");
      }
      return {
        cat_id: Number(result.insertId),
        cat_name: trimmedName
      };

    } catch (err) {
      console.error("Error in createCategory:", err);
      if (err.code === 'ER_DUP_ENTRY') {
        console.warn(`Attempted to insert duplicate category name: ${trimmedName}`);
        throw new Error(`Category "${trimmedName}" already exists.`);
      }
      throw new Error("Failed to create category due to a database error.");
    }
  }
};