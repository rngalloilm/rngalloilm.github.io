import HTTPClient from './HTTPClient.js';

const BASE_API_PATH = '/api';

const handleAuthError = (error) => {
  if(error.status === 401) {
    console.warn("Authentication error (401). Redirecting to login.");
    document.location = '/login';
  }
  throw error;
};

const logIn = (username, password) => {
  const data = {
    username: username,
    password: password
  };
  return HTTPClient.post(`${BASE_API_PATH}/auth/login`, data);
};

const logOut = () => {
  return HTTPClient.post(`${BASE_API_PATH}/auth/logout`, {});
};

const getCurrentUser = () => {
  return HTTPClient.get(`${BASE_API_PATH}/auth/current`)
  .catch(handleAuthError);
};

const register = (firstName, lastName, username, password, repeatPass) => {
  const data = {
    firstName: firstName,
    lastName: lastName,
    username: username,
    password: password,
    repeatPassword: repeatPass
  }
  return HTTPClient.post(`${BASE_API_PATH}/auth/register`, data);
}

const getMonthlySpending = () => {
  return HTTPClient.get(`${BASE_API_PATH}/dashboard/spending`);
}

const getFreeCash = () => {
  return HTTPClient.get(`${BASE_API_PATH}/dashboard/unallocated`);
}

const addIncome = (data) => {
  return HTTPClient.post(`${BASE_API_PATH}/income`, data);
}

const getIncomes = () => {
  return HTTPClient.get(`${BASE_API_PATH}/income`);
}

const deleteIncome = (incomeId) => {
  return HTTPClient.delete(`${BASE_API_PATH}/income/${incomeId}`);
}

const updateIncome = (incomeId, data) => {
  return HTTPClient.put(`${BASE_API_PATH}/income/${incomeId}`, data);
}

const addExpense = (data) => {
  return HTTPClient.post(`${BASE_API_PATH}/expenses`, data);
}

const getExpenses = () => {
  return HTTPClient.get(`${BASE_API_PATH}/expenses`);
}

const deleteExpense = (expenseId) => {
  return HTTPClient.delete(`${BASE_API_PATH}/expenses/${expenseId}`);
}

const updateExpense = (expenseId, data) => {
  return HTTPClient.put(`${BASE_API_PATH}/expenses/${expenseId}`, data);
}

const getCategories = () => {
  return HTTPClient.get(`${BASE_API_PATH}/categories`)
    .catch(handleAuthError); 
};

const addCategory = (categoryData) => {
  return HTTPClient.post(`${BASE_API_PATH}/categories`, categoryData)
    .catch(handleAuthError); 
};

const getReportOverview = () => {
  return HTTPClient.get(`${BASE_API_PATH}/reports/overview`);
}

const getCalendarEvents = () => {
  return HTTPClient.get(`${BASE_API_PATH}/calendar/events`)
    .catch(handleAuthError);
}


export default {
  handleAuthError,
  getCurrentUser,
  logIn,
  logOut,
  register,
  getMonthlySpending,
  getFreeCash,
  addIncome,
  getIncomes,
  deleteIncome,
  updateIncome,
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
  getCategories,
  addCategory,
  getReportOverview,
  getCalendarEvents
};
