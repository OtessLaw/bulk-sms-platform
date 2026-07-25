import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// User Pages
import Dashboard from './pages/dashboard/Dashboard';
import SendSMS from './pages/SendSMS';
import Contacts from './pages/Contacts';
import Campaigns from './pages/Campaigns';
import Wallet from './pages/Wallet';
import Subscriptions from './pages/Subscriptions';
import DeveloperAPI from './pages/DeveloperAPI';
import SenderIDs from './pages/SenderIDs';
import Reports from './pages/Reports';
import Team from './pages/Team';
import Settings from './pages/Settings';
import HelpCenter from './pages/HelpCenter';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSenderIDs from './pages/admin/AdminSenderIDs';
import AdminGatewaySwitch from './pages/admin/AdminGatewaySwitch';
import AdminStaff from './pages/admin/AdminStaff';
import AdminSystemSettings from './pages/admin/AdminSystemSettings';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1E232B] flex items-center justify-center text-[#D4AF6A] font-semibold text-sm">
        Loading FasReach Platform...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/send-sms"
        element={
          <ProtectedRoute>
            <SendSMS />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contacts"
        element={
          <ProtectedRoute>
            <Contacts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/campaigns"
        element={
          <ProtectedRoute>
            <Campaigns />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wallet"
        element={
          <ProtectedRoute>
            <Wallet />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscriptions"
        element={
          <ProtectedRoute>
            <Subscriptions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/developer-api"
        element={
          <ProtectedRoute>
            <DeveloperAPI />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sender-ids"
        element={
          <ProtectedRoute>
            <SenderIDs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/team"
        element={
          <ProtectedRoute>
            <Team />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/help"
        element={
          <ProtectedRoute>
            <HelpCenter />
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/sender-ids"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminSenderIDs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/gateway-switch"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminGatewaySwitch />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/staff"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminStaff />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminSystemSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit-logs"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminAuditLogs />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
