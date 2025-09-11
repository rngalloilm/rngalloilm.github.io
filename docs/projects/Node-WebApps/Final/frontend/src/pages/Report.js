import React, { useState, useEffect } from 'react';
// import '../styles/reportStyle.css';
import SidebarMenu from './SidebarMenuComponent';
import api from '../js/APIClient';
import EditIncome from './EditIncome';
import EditExpense from './EditExpense';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const dateOnly = dateString.split('T')[0];
    return new Date(dateOnly).toLocaleDateString(undefined, {
       year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC'
    });
  } catch (e) {
    console.warn("Date formatting failed for:", dateString, e);
    return dateString; 
  }
};

const formatFrequency = (freq) => {
    if (!freq || freq === 'none') return 'One Time';
    return freq.charAt(0).toUpperCase() + freq.slice(1); 
}

function Report() {
  const [reportData, setReportData] = useState([]);
  const [reportError, setReportError] = useState('');
  const [loadingReport, setLoadingReport] = useState(true);

  const [incomes, setIncomes] = useState([]);
  const [incomeError, setIncomeError] = useState('');
  const [loadingIncomes, setLoadingIncomes] = useState(true);

  const [expenses, setExpenses] = useState([]);
  const [expenseError, setExpenseError] = useState('');
  const [loadingExpenses, setLoadingExpenses] = useState(true);

  const [isEditIncomeOpen, setIsEditIncomeOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [isEditExpenseOpen, setIsEditExpenseOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState('');
 
  const fetchReportOverview = async () => {
    setLoadingReport(true);
    setReportError('');
    try {
      const data = await api.getReportOverview();
      setReportData(data || []);
    }
    catch(error) {
      console.error("Error fetching report overview.");
      setReportError("Error loading report data.");
    }
    finally {
      setLoadingReport(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    setLoadingCategories(true);
    setCategoryError('');
    api.getCategories()
        .then(data => { if (isMounted) setCategories(data || []); })
        .catch(err => {
            console.error("Error fetching categories:", err);
            if (isMounted) setCategoryError("Could not load categories for editing.");
         })
        .finally(() => { if (isMounted) setLoadingCategories(false); });

    fetchReportOverview();

    setLoadingIncomes(true);
    setIncomeError('');
    api.getIncomes()
      .then(data => setIncomes(data || []))
      .catch(err => {
        console.error("Error fetching incomes:", err);
        setIncomeError("Error loading income list.");
      })
      .finally(() => setLoadingIncomes(false));
      
      setLoadingExpenses(true);
      setExpenseError('');
      api.getExpenses()
        .then(data => setExpenses(data || []))
        .catch(err => {
          console.error("Error fetching expenses:", err);
          setExpenseError("Error loading expense list.");
        })
        .finally(() => setLoadingExpenses(false));

      return () => { isMounted = false; };
  }, []); 

  const handleDeleteIncome = (incomeId) => {
    setIncomeError(''); 
    if (window.confirm('Are you sure you want to delete this income record?')) {
      api.deleteIncome(incomeId)
        .then(() => {
          setIncomes(prevIncomes => prevIncomes.filter(inc => inc.tra_id !== incomeId));
        })
        .catch(err => {
          console.error("Error deleting income:", err);
          setIncomeError(`Failed to delete income: ${err.message || 'Please try again.'}`);
        });
    }
  };

  const handleDeleteExpense = (expenseId) => {
    setExpenseError(''); 
    if (window.confirm('Are you sure you want to delete this expense record?')) {
      api.deleteExpense(expenseId)
        .then(() => {
          setExpenses(prevExpenses => prevExpenses.filter(exp => exp.tra_id !== expenseId));
          fetchReportOverview();
        })
        .catch(err => {
          console.error("Error deleting expense:", err);
          setExpenseError(`Failed to delete expense: ${err.message || 'Please try again.'}`);
        });
    }
  };

  const handleEditIncome = (incomeRecord) => {
    setEditingIncome(incomeRecord);
    setIsEditIncomeOpen(true);
  };

  const handleEditExpense = (expenseRecord) => {
    setIsEditExpenseOpen(true);
    setEditingExpense(expenseRecord);
  };

  const handleIncomeClose = () => {
    setIsEditIncomeOpen(false);
    setEditingIncome(null);
  };

  const handleIncomeSave = (updatedIncome) => {
    setIncomes(prevIncomes =>
      prevIncomes.map(inc =>
        inc.tra_id === updatedIncome.tra_id ? updatedIncome : inc
      )
    );
    handleIncomeClose();
  };

  const handleExpenseClose = () => {
    setIsEditExpenseOpen(false);
    setEditingExpense(null);
  }

  const handleExpenseSave = (updatedExpense) => {
    setExpenses(prevExpenses =>
      prevExpenses.map(exp => exp.tra_id === updatedExpense.tra_id ? updatedExpense : exp)
    );
    fetchReportOverview();
    handleExpenseClose();
  }

  const renderTableSection = (title, loading, error, data, columns, renderRow) => {
    return (
      <section className="mb-5">
        <h3>{title}</h3>
        {loading && (
          <div className="d-flex justify-content-center my-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}
        {!loading && !error && (
          <div className="table-responsive shadow-sm">
            <table className="table table-striped table-hover table-sm caption-top">
               <caption>List of {title.toLowerCase()} transactions</caption>
              <thead className="table-light"> 
                <tr>
                  {columns.map(col => <th key={col.key} scope="col">{col.label}</th>)}
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map(item => renderRow(item))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="text-center text-muted fst-italic py-3">
                      No {title.toLowerCase()} found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    );
  };

  const expenseColumns = [
      { key: 'date', label: 'Date' },
      { key: 'desc', label: 'Description' },
      { key: 'cat', label: 'Category' },
      { key: 'freq', label: 'Frequency' },
      { key: 'amount', label: 'Amount ($)' },
      { key: 'actions', label: 'Actions' }
  ];

  const incomeColumns = [
      { key: 'date', label: 'Date' },
      { key: 'desc', label: 'Description' },
      { key: 'freq', label: 'Frequency' },
      { key: 'amount', label: 'Amount ($)' },
      { key: 'actions', label: 'Actions' }
  ];

  const renderExpenseRow = (exp) => (
    <tr key={exp.tra_id}>
      <td>{formatDate(exp.tra_date)}</td>
      <td>{exp.tra_description || '-'}</td>
      <td>{exp.cat_name || 'N/A'}</td> 
      <td>{formatFrequency(exp.tra_recurring_frequency)}</td>
      <td className="text-danger text-left">
      { !isNaN(parseFloat(exp.tra_amount)) ? `-${parseFloat(exp.tra_amount).toFixed(2)}`: 'N/A' }
      </td>
      <td className='text-nowrap'>
        <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleEditExpense(exp)} title="Edit Expense">
          <i className="fas fa-edit"></i>
        </button>
        <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteExpense(exp.tra_id)} title="Delete Expense">
          <i className="fas fa-trash-alt"></i>
        </button>
      </td>
    </tr>
  );

  const renderIncomeRow = (inc) => (
    <tr key={inc.tra_id}>
      <td>{formatDate(inc.tra_date)}</td>
      <td>{inc.tra_description || '-'}</td>
      <td>{formatFrequency(inc.tra_recurring_frequency)}</td>
      <td className="text-success text-left">
        { !isNaN(parseFloat(inc.tra_amount)) ? `+${parseFloat(inc.tra_amount).toFixed(2)}`: 'N/A' }
      </td>
      <td className='text-nowrap'>
        <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handleEditIncome(inc)} title="Edit Income">
          <i className="fas fa-edit"></i>
        </button>
        <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteIncome(inc.tra_id)} title="Delete Income">
          <i className="fas fa-trash-alt"></i>
        </button>
      </td>
    </tr>
  );


  return (
    <div className="d-flex flex-column">
      <SidebarMenu />
      <main className="container-fluid p-4 report-content flex-grow-1">
         <section className="mb-5">
          <h3>Spent This Month by Category</h3>
           {loadingReport && <p>Loading report...</p>}
          {reportError && <div className="alert alert-danger">{reportError}</div>}
          {!loadingReport && !reportError && (
             <div className="table-responsive shadow-sm">
               <table className="table table-striped table-sm">
                 <thead className="table-light">
                   <tr>
                     <th scope="col">Category</th>
                     <th scope="col">Amount ($)</th>
                   </tr>
                 </thead>
                 <tbody>
                   {reportData.length > 0 ? reportData.map((item, index) => (
                     <tr key={index}>
                       <td>{item.cat_name}</td>
                       <td className="text-end">{!isNaN(parseFloat(item.total)) ? `${parseFloat(item.total).toFixed(2)}` : 'N/A'}</td>
                     </tr>
                   )) : (
                      <tr><td colSpan="2" className="text-center text-muted fst-italic py-3">No spending data for this month.</td></tr>
                   )}
                 </tbody>
               </table>
             </div>
           )}
        </section>

        <hr className="my-4"/>
        {categoryError && <div className="alert alert-warning">{categoryError}</div>}
        {renderTableSection('Expenses', loadingExpenses, expenseError, expenses, expenseColumns, renderExpenseRow)}

        <hr className="my-4"/>

        {renderTableSection('Income', loadingIncomes, incomeError, incomes, incomeColumns, renderIncomeRow)}

      </main>
      <EditIncome 
        isOpen={isEditIncomeOpen}
        onClose={handleIncomeClose}
        onSave={handleIncomeSave}
        incomeToEdit={editingIncome}
      /> 
      <EditExpense 
        isOpen={isEditExpenseOpen}
        onClose={handleExpenseClose}
        onSave={handleExpenseSave}
        expenseToEdit={editingExpense}
        categories={categories}
      />
    </div> 
  );
}

export default Report;