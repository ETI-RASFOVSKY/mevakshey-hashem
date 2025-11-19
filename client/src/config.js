// קובץ הגדרות מרכזי
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// פונקציה עזר לקבלת token מ-localStorage
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// פונקציה עזר לשמירת token
export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

// פונקציה עזר למחיקת token
export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// פונקציה עזר לבדיקה אם משתמש מחובר
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// פונקציה עזר ליצירת headers עם token
export const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// פונקציה עזר ליצירת headers עם token עבור FormData
export const getAuthHeadersFormData = () => {
  const token = getAuthToken();
  const headers = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};



