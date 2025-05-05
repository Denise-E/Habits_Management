import React from 'react';
import ReactDOM from 'react-dom/client';
import { Router, Route, Redirect } from 'wouter';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';

const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Route path="/" component={() => (
        isAuthenticated ? <Redirect to="/home" /> : <Redirect to="/login" />
      )} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/home" component={HomePage} />
    </Router>
  </React.StrictMode>
);
