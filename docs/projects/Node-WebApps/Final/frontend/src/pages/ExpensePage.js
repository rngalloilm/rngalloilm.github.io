import React, { useState, useEffect } from 'react';
import '../styles/expense.css';
import SidebarMenu from './SidebarMenuComponent';
import api from '../js/APIClient';

function ExpensePage() {
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [expenseFrequency, setExpenseFrequency] = useState('none');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [categories, setCategories] = useState([]);

  const [expenseLoading, setExpenseLoading] = useState(false); 
  const [categoryLoading, setCategoryLoading] = useState(false); 
  const [error, setError] = useState(''); 
  const [success, setSuccess] = useState(''); 
  const [categoryError, setCategoryError] = useState(''); 

  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    setCategoryLoading(true); 
    setError('');
    setCategoryError('');
    api.getCategories()
      .then(data => {
        setCategories(data || []);
        setCategoryLoading(false);
      })
      .catch(err => {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please refresh or try again later.");
        setCategoryLoading(false);
      });
  }, []);

  const resetForm = () => {
    setExpenseAmount('');
    setExpenseDate('');
    setSelectedCategoryId('');
    setExpenseFrequency('none');
    setExpenseDescription('');
    setShowNewCategoryForm(false);
    setNewCategoryName('');
    setError(''); 
    // setSuccess('');
    setCategoryError('');
  };

  const handleAddNewCategory = () => {
    setCategoryError('');
    const trimmedName = newCategoryName.trim();

    if (!trimmedName) {
      setCategoryError("Please enter a name for the new category.");
      return;
    }

    setCategoryLoading(true); 

    api.addCategory({ name: trimmedName })
      .then(newCategory => { 
        console.log("Category added successfully:", newCategory);
        setCategories([...categories, newCategory].sort((a, b) => a.cat_name.localeCompare(b.cat_name))); // Keep sorted
        setSelectedCategoryId(newCategory.cat_id.toString()); 
        setNewCategoryName('');
        setShowNewCategoryForm(false);
        setCategoryLoading(false);
      })
      .catch(err => {
        console.error("Failed to add category:", err);
        setCategoryError(err.message || "Failed to add category. Please try again.");
        setCategoryLoading(false);
      });
  };

  const handleAddExpense = () => {
    setError('');
    setSuccess('');
    setCategoryError(''); 

    const amount = parseFloat(expenseAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid positive amount."); return;
    }
    if (!expenseDate) {
      setError("Please select a date."); return;
    }
    if (!selectedCategoryId) {
      setError("Please select a category."); return;
    }

    const expenseData = {
      amount: amount,
      date: expenseDate,
      categoryId: parseInt(selectedCategoryId, 10),
      frequency: expenseFrequency,
      description: expenseDescription || null,
    };

    setExpenseLoading(true); 

    api.addExpense(expenseData)
      .then(response => {
        console.log("Expense added successfully:", response);
        setSuccess("Expense added successfully!");
        resetForm();
        setExpenseLoading(false);
      })
      .catch(err => {
        console.error("Failed to add expense:", err);
        setError(err.message || "Failed to add expense. Please try again.");
        setExpenseLoading(false);
      });
  };

  const isOverallLoading = expenseLoading || categoryLoading;

  return (
    <div className="expense-page-wrapper">
      <SidebarMenu />
      <div className="form-container">
        <h2>Add Expense</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        {categoryLoading && !categories.length && <p>Loading categories...</p>}
        <div className="input-group">
          <label htmlFor="expense-amount">Amount:</label>
          <input
            type="number" id="expense-amount" value={expenseAmount}
            onChange={e => setExpenseAmount(e.target.value)}
            placeholder="$" disabled={isOverallLoading} required
          />
        </div>
        <div className="input-group date-wrapper">
          <label htmlFor="expense-date">Date:</label>
          <input
            type="date" id="expense-date" value={expenseDate}
            onChange={e => setExpenseDate(e.target.value)}
            disabled={isOverallLoading} required
          />
        </div>
        <div className="input-group">
          <label htmlFor="expense-description">Description (Optional):</label>
          <input
            type="text" id="expense-description" value={expenseDescription}
            onChange={e => setExpenseDescription(e.target.value)}
            placeholder="e.g., Groceries" disabled={isOverallLoading}
          />
        </div>
        <div className="frequency-options">
          {['none', 'weekly', 'monthly'].map(freq => (
            <label key={freq}>
              <input type="radio" name="expense-frequency" value={freq}
                     checked={expenseFrequency === freq}
                     onChange={e => setExpenseFrequency(e.target.value)}
                     disabled={isOverallLoading} />
              {freq.charAt(0).toUpperCase() + freq.slice(1)} 
            </label>
          ))}
        </div>
        <div className="input-group">
          <label htmlFor="expense-category">Category:</label>
          <select
            id="expense-category" value={selectedCategoryId}
            onChange={e => setSelectedCategoryId(e.target.value)}
            disabled={isOverallLoading || !categories.length}
            required
          >
            <option value="" disabled>-- Select Category --</option>
            {categories.map(category => (
              <option key={category.cat_id} value={category.cat_id.toString()}>
                {category.cat_name}
              </option>
            ))}
          </select>
          <button type="button"
            className="add-category-btn"
            onClick={() => {
              setShowNewCategoryForm(!showNewCategoryForm);
              setCategoryError('');
              if (showNewCategoryForm) setNewCategoryName('');
            }}
            disabled={isOverallLoading}
          >
            {showNewCategoryForm ? 'Cancel Add' : 'Add New'}
          </button>
        </div>
        {showNewCategoryForm && (
          <div className="new-category-form">
            {categoryError && <p className="error-message" style={{ color: 'red', marginBottom: '5px' }}>{categoryError}</p>}
            <input
              type="text"
              placeholder="New Category Name"
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              disabled={categoryLoading}
              aria-label="New Category Name"
            />
            <button type="button" onClick={handleAddNewCategory} disabled={categoryLoading}>
              {categoryLoading ? 'Adding...' : 'Save Category'}
            </button>
          </div>
        )}
        <button className="submit-btn" onClick={handleAddExpense} disabled={isOverallLoading}>
          {expenseLoading ? 'Submitting Expense...' : 'Submit Expense'}
        </button>
      </div>
    </div>
  );
}

export default ExpensePage;