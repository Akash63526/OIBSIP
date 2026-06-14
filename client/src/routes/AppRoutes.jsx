import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import PrivateRoute from './PrivateRoute';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage';

// User Pages
import DashboardPage from '../pages/user/DashboardPage';
import MenuPage from '../pages/user/MenuPage';
import PizzaBuilderPage from '../pages/user/PizzaBuilderPage';
import CartPage from '../pages/user/CartPage';
import CheckoutPage from '../pages/user/CheckoutPage';
import OrdersPage from '../pages/user/OrdersPage';
import ProfilePage from '../pages/user/ProfilePage';
import OffersPage from '../pages/user/OffersPage';
import AboutPage from '../pages/user/AboutPage';
import DeliveryPage from '../pages/user/DeliveryPage';
import ContactPage from '../pages/user/ContactPage';

// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminInventoryPage from '../pages/admin/AdminInventoryPage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminReportsPage from '../pages/admin/AdminReportsPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';
import AdminCustomersPage from '../pages/admin/AdminCustomersPage';
import AdminMenuPage from '../pages/admin/AdminMenuPage';
import AdminDeliveryPage from '../pages/admin/AdminDeliveryPage';
import AdminOffersPage from '../pages/admin/AdminOffersPage';
import AdminReviewsPage from '../pages/admin/AdminReviewsPage';
import AdminTicketsPage from '../pages/admin/AdminTicketsPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes with Main Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/build-pizza" element={<PizzaBuilderPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/delivery" element={<DeliveryPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        {/* Protected User Routes — require login */}
        <Route element={<PrivateRoute />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="inventory" element={<AdminInventoryPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="customers" element={<AdminCustomersPage />} />
        <Route path="menu" element={<AdminMenuPage />} />
        <Route path="delivery" element={<AdminDeliveryPage />} />
        <Route path="offers" element={<AdminOffersPage />} />
        <Route path="reviews" element={<AdminReviewsPage />} />
        <Route path="support" element={<AdminTicketsPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
