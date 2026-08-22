import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layout & Public Landing
import DashboardLayout from './components/layout/DashboardLayout';
import LandingPage from './pages/LandingPage';
import ProductHub from './pages/ProductHub';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// User Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import SendSMS from './pages/SendSMS';
import VoiceSMS from './pages/VoiceSMS';
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

// Super Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSenderIDs from './pages/admin/AdminSenderIDs';
import AdminGatewaySwitch from './pages/admin/AdminGatewaySwitch';
import AdminStaff from './pages/admin/AdminStaff';
import AdminSystemSettings from './pages/admin/AdminSystemSettings';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import AdminAiManagement from './pages/admin/AdminAiManagement';

// Scroll To Top on Route Change Component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      window.scrollTo(0, 0);
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.scrollTop = 0;
      }
    } catch (e) {
      // Ignore scroll errors
    }
  }, [pathname]);

  return null;
}

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1E232B] flex items-center justify-center text-white p-4">
        <div className="flex flex-col items-center space-y-4">
          <img src="/logo.jpg" alt="FasReach" className="w-14 h-14 rounded-2xl object-cover border-2 border-[#D4AF6A]/50 animate-pulse shadow-2xl" />
          <div className="w-8 h-8 border-4 border-[#D4AF6A] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-[#D4AF6A]">FasReach Platform Loading...</p>
        </div>
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

function SubdomainRootHandler() {
  const hostname = window.location.hostname.toLowerCase();

  if (hostname.startsWith('sms.')) {
    return <Navigate to="/send-sms" replace />;
  }
  if (hostname.startsWith('voice.')) {
    return <Navigate to="/voice-sms" replace />;
  }
  if (hostname.startsWith('app.') || hostname.startsWith('portal.')) {
    return <ProductHub />;
  }

  return <LandingPage />;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#2A3038',
              color: '#FFFFFF',
              border: '1px solid rgba(212, 175, 106, 0.3)',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#D4AF6A',
                secondary: '#1A1D24',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FFFFFF',
              },
            },
            loading: {
              iconTheme: {
                primary: '#D4AF6A',
                secondary: '#1A1D24',
              },
            },
          }}
        />
        <Routes>
          {/* Public Landing Page & Subdomain Router */}
          <Route path="/" element={<SubdomainRootHandler />} />
          <Route path="/products" element={<ProductHub />} />
          <Route path="/portal" element={<ProductHub />} />

          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* User Protected Routes */}
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
            path="/voice-sms"
            element={
              <ProtectedRoute>
                <VoiceSMS />
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

          {/* Super Admin Protected Routes */}
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
            path="/admin/ai-management"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminAiManagement />
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

          {/* Catch-all Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
