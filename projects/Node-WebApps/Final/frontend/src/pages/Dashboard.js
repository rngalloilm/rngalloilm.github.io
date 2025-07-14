import React, { useEffect } from 'react';
import '../styles/dashboardStyle.css';
import CalendarComponent from './CalendarComponent';
import SidebarMenu from './SidebarMenuComponent';
import api from '../js/APIClient';

function Dashboard() {

  function getMonthlySpending() {
    const monthlySpending = document.querySelector('#monthlySpending');
    api.getMonthlySpending()
      .then(response => {
        const spending = response.data.data;
        monthlySpending.textContent = `$${response.data}`;
      })
      .catch(err => {
        monthlySpending.textContent = "Error getting monthly spending";
      });
  }

  function getFreeCash() {
    const freeCash = document.querySelector('#freeCash');
    api.getFreeCash()
      .then(response => {
        freeCash.textContent = `$${response.data.toFixed(2)}`;
      })
      .catch(err => {
        freeCash.textContent = "Error getting unallocated cash";
      });
  }

  useEffect(() => {
    getMonthlySpending();
    getFreeCash();
  }, []);

  return (
    <div className="dashboard"> {/* Scoped styles */}
      <SidebarMenu />

      <section className="dashboard-section">
        <div className="dashboard-container">
          {/* FINANCIAL SUMMARY */}
          <div className="financial-summary">
            <div className="summary-box">
              <h3>Spent this Month/Week So Far:</h3>
              <div className="amount-box" id="monthlySpending"></div>
            </div>

            <div className="summary-box">
              <h3>Unallocated Cash this Month:</h3>
              <div className="amount-box" id="freeCash"></div>
            </div>
          </div>

          {/* CALENDAR COMPONENT */}
          <CalendarComponent />
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
