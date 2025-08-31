import React, { useState, useEffect } from 'react';
import api from '../js/APIClient';

const formatFrequency = (freq) => {
  if (!freq || freq === 'none') return 'One Time';
  return freq.charAt(0).toUpperCase() + freq.slice(1); // Capitalize (e.g., Weekly, Monthly)
};

function EditIncome({ isOpen, onClose, onSave, incomeToEdit }) {
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('none');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (incomeToEdit) {
      const formattedDate = incomeToEdit.tra_date ? incomeToEdit.tra_date.split('T')[0] : '';
      setDate(formattedDate);
      setAmount(incomeToEdit.tra_amount || '');
      setDescription(incomeToEdit.tra_description || '');
      setFrequency(incomeToEdit.tra_recurring_frequency || 'none');
      setError(''); 
    } else {
       setDate('');
       setAmount('');
       setDescription('');
       setFrequency('none');
       setError('');
    }
  }, [incomeToEdit]); 

  const handleSaveChanges = async () => {
    setError(''); 
    const parsedAmount = parseFloat(amount);

    if (!date) { setError("Date is required."); return; }
    if (isNaN(parsedAmount) || parsedAmount <= 0) { setError("Please enter a valid positive amount."); return; }

    setLoading(true);

    const updatedData = {
      date: date,
      amount: parsedAmount,
      description: description,
      frequency: frequency,
    };

    try {
      const updatedIncome = await api.updateIncome(incomeToEdit.tra_id, updatedData);
      console.log("DEBUG: Received updated income in modal:", updatedIncome);
      onSave(updatedIncome); 
    } catch (err) {
      console.error("Failed to update income:", err);
      setError(err.message || "Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !incomeToEdit) {
    return null;
  }

  return (
    <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}> {/* Bootstrap modal classes */}
      <div className="modal-dialog modal-dialog-centered"> 
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Income</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close" disabled={loading}></button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Amount Field */}
            <div className="mb-3">
              <label htmlFor="edit-income-amount" className="form-label">Amount:</label>
              <input
                type="number"
                className="form-control"
                id="edit-income-amount"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                disabled={loading}
                required
                step="0.01"
              />
            </div>

            {/* Date Field */}
            <div className="mb-3">
              <label htmlFor="edit-income-date" className="form-label">Date:</label>
              <input
                type="date"
                className="form-control"
                id="edit-income-date"
                value={date}
                onChange={e => setDate(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {/* Description Field */}
            <div className="mb-3">
              <label htmlFor="edit-income-description" className="form-label">Description (Optional):</label>
              <input
                type="text"
                className="form-control"
                id="edit-income-description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g., Paycheck, Side Job"
                disabled={loading}
              />
            </div>

             {/* Frequency Options */}
             <div className="mb-3">
               <label className="form-label d-block">Frequency:</label>
               {['none', 'weekly', 'monthly'].map(freqValue => (
                  <div className="form-check form-check-inline" key={freqValue}>
                      <input
                          className="form-check-input"
                          type="radio"
                          name="edit-income-frequency"
                          id={`edit-freq-${freqValue}`}
                          value={freqValue}
                          checked={frequency === freqValue}
                          onChange={e => setFrequency(e.target.value)}
                          disabled={loading}
                      />
                      <label className="form-check-label" htmlFor={`edit-freq-${freqValue}`}>
                          {formatFrequency(freqValue)} 
                      </label>
                  </div>
               ))}
            </div>

          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="button" className="btn btn-primary" onClick={handleSaveChanges} disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditIncome;