// frontend/src/pages/EditExpenseModal.js
import React, { useState, useEffect } from 'react';
import api from '../js/APIClient';

const formatFrequency = (freq) => {
    if (!freq || freq === 'none') return 'One Time';
    return freq.charAt(0).toUpperCase() + freq.slice(1);
};

function EditExpense({ isOpen, onClose, onSave, expenseToEdit, categories = [] }) { 
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [frequency, setFrequency] = useState('none');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (expenseToEdit) {
      const formattedDate = expenseToEdit.tra_date ? expenseToEdit.tra_date.split('T')[0] : '';
      setDate(formattedDate);
      setAmount(expenseToEdit.tra_amount || '');
      setDescription(expenseToEdit.tra_description || '');
      setSelectedCategoryId(expenseToEdit.tra_category_id?.toString() || ''); 
      setFrequency(expenseToEdit.tra_recurring_frequency || 'none');
      setError('');
    } else {
       setDate('');
       setAmount('');
       setDescription('');
       setSelectedCategoryId('');
       setFrequency('none');
       setError('');
    }
  }, [expenseToEdit]);

  const handleSaveChanges = async () => {
    setError('');
    const parsedAmount = parseFloat(amount);
    const categoryId = parseInt(selectedCategoryId, 10);

    if (!date) { setError("Date is required."); return; }
    if (isNaN(parsedAmount) || parsedAmount <= 0) { setError("Please enter a valid positive amount."); return; }
    if (!selectedCategoryId || isNaN(categoryId)) { setError("Please select a valid category."); return; }

    setLoading(true);

    const updatedData = {
      date: date,
      amount: parsedAmount,
      description: description,
      categoryId: categoryId, 
      frequency: frequency,
    };

    try {
      const updatedExpense = await api.updateExpense(expenseToEdit.tra_id, updatedData);
      onSave(updatedExpense);
    } catch (err) {
      console.error("Failed to update expense:", err);
      setError(err.message || "Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !expenseToEdit) {
    return null;
  }

  return (
    <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Expense</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close" disabled={loading}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Amount */}
            <div className="mb-3">
              <label htmlFor="edit-expense-amount" className="form-label">Amount:</label>
              <input type="number" className="form-control" id="edit-expense-amount" value={amount} onChange={e => setAmount(e.target.value)} disabled={loading} required step="0.01"/>
            </div>

            {/* Date */}
            <div className="mb-3">
              <label htmlFor="edit-expense-date" className="form-label">Date:</label>
              <input type="date" className="form-control" id="edit-expense-date" value={date} onChange={e => setDate(e.target.value)} disabled={loading} required/>
            </div>

            {/* Description */}
            <div className="mb-3">
              <label htmlFor="edit-expense-description" className="form-label">Description (Optional):</label>
              <input type="text" className="form-control" id="edit-expense-description" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g., Groceries" disabled={loading}/>
            </div>

            {/* Category Dropdown */}
            <div className="mb-3">
                <label htmlFor="edit-expense-category" className="form-label">Category:</label>
                <select
                    id="edit-expense-category"
                    className="form-select"
                    value={selectedCategoryId}
                    onChange={e => setSelectedCategoryId(e.target.value)}
                    disabled={loading || categories.length === 0}
                    required
                >
                    <option value="" disabled>-- Select Category --</option>
                    {categories.map(category => (
                        <option key={category.cat_id} value={category.cat_id.toString()}> {/* Ensure value is string */}
                            {category.cat_name}
                        </option>
                    ))}
                </select>
            </div>


             {/* Frequency Options */}
             <div className="mb-3">
               <label className="form-label d-block">Frequency:</label>
               {['none', 'weekly', 'monthly'].map(freqValue => (
                  <div className="form-check form-check-inline" key={freqValue}>
                      <input className="form-check-input" type="radio" name="edit-expense-frequency" id={`edit-exp-freq-${freqValue}`} value={freqValue} checked={frequency === freqValue} onChange={e => setFrequency(e.target.value)} disabled={loading}/>
                      <label className="form-check-label" htmlFor={`edit-exp-freq-${freqValue}`}>{formatFrequency(freqValue)}</label>
                  </div>
               ))}
            </div>

          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={handleSaveChanges} disabled={loading}>
              {loading ? (<><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...</>) : ('Save Changes')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditExpense;