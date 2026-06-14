import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard    from './pages/Dashboard';
import AdminPanel   from './pages/AdminPanel';
import PizzaBuilder from './pages/PizzaBuilder';
import CheckoutPage from './pages/CheckoutPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<LoginPage />} />
        <Route path="/register"  element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/build"     element={<PizzaBuilder />} />
        <Route path="/admin"     element={<AdminPanel />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;