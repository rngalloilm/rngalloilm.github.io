import api from '../js/APIClient';
import React, { useState } from 'react';
import '../styles/income.css';
import SidebarMenu from './SidebarMenuComponent';


function IncomePage() {
  const [income, setIncome] = useState('');
  const [incomeDate, setIncomeDate] = useState('');
  const [incomeFrequency, setIncomeFrequency] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddIncome = () => {
    setError('');
    setSuccess('');
    const amount = parseFloat(income);
    console.log(income);
    if (isNaN(amount) || amount < 0) {
      setError('Please enter a valid positive amount.');
      return;
    }
    if (!incomeDate) {
      setError('Please select a date.');
      return;
    }

    const incomeData = {
      amount: amount,
      date: incomeDate,
      frequency: incomeFrequency,
      description: null
    };

    api.addIncome(incomeData)
      .then(response => {
        console.log("Income added successfully:", response);
        setSuccess('Income added successfully.');
        setIncome('');
        setIncomeDate('');
        setIncomeFrequency('none');
      })
      .catch(error => {
        console.error('Failed to add income:', error);
        setError(error.message || "Failed to add income. Please try again.");
        setSuccess('');
      });
  };

  return (
    <div className="income-page-wrapper">
      <SidebarMenu />
      <div className="form-container">
        <h2>Add Income</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <div className="input-group">
          <label htmlFor="income-amount">Amount:</label>
          <input 
            type="number" 
            id="income-amount" 
            value={income} 
            onChange={e => setIncome(e.target.value)} 
            placeholder="$" 
          />
        </div>
        <div className="input-group date-wrapper">
          <label htmlFor="income-date">Date:</label>
          <input type="date" id="income-date" value={incomeDate} onChange={e => setIncomeDate(e.target.value)}/>
        </div>
        <div className="frequency-options">
          <label>
            <input type="radio" name="income-frequency" value="none" checked={incomeFrequency === 'none'} 
              onChange={e => setIncomeFrequency(e.target.value)}/>
            One Time
          </label>
          <label>
          <input type="radio" name="income-frequency" value="weekly" checked={incomeFrequency === 'weekly'} 
              onChange={e => setIncomeFrequency(e.target.value)}/>
            Weekly
          </label>
          <label>
          <input type="radio" name="income-frequency" value="monthly" checked={incomeFrequency === 'monthly'} 
              onChange={e => setIncomeFrequency(e.target.value)}/>
            Monthly
          </label>
        </div>
        <button className="submit-btn" onClick={handleAddIncome}>Submit Income</button>
      </div>
    </div>
  );
}

export default IncomePage;

