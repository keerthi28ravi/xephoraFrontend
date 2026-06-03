import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth Pages
import SplashScreen   from './pages/SplashScreen';
import Home           from './pages/Home';
import Login          from './pages/Login';
import Register       from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP      from './pages/VerifyOTP';
import ResetPassword  from './pages/ResetPassword';

// Main Platform Pages (inside AppShell with sidebar)
import AppShell         from './components/AppShell';
import Dashboard        from './pages/Dashboard';
import Profile          from './pages/Profile';
import AboutXephora     from './pages/AboutXephora';
import ModesHub         from './pages/ModesHub';
import MemoryNexus      from './pages/MemoryNexus';
import LogicArena       from './pages/LogicArena';
import NumberRush       from './pages/NumberRush';
import StrategyZone     from './pages/StrategyZone';
import MultiplayerArena from './pages/MultiplayerArena';
import AINeuralEngine   from './pages/AINeuralEngine';
import SkillAnalytics   from './pages/SkillAnalytics';
import Leaderboard      from './pages/Leaderboard';
import Achievements     from './pages/Achievements';
import CommunityHub     from './pages/CommunityHub';
import Tournaments      from './pages/Tournaments';
import Notifications    from './pages/Notifications';
import PremiumPlans     from './pages/PremiumPlans';
import Settings         from './pages/Settings';
import HelpSupport      from './pages/HelpSupport';
import FAQ              from './pages/FAQ';
import Contact          from './pages/Contact';
import AdminPanel       from './pages/AdminPanel';

// ─── Route Guards ─────────────────────────────────────────────────────────────
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="loader-bar" style={{ width: '60%' }}></div></div>;
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/dashboard" replace />;
};

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Splash / public landing */}
          <Route path="/" element={<SplashScreen />} />
          <Route path="/home" element={<Home />} />

          {/* Auth routes – redirect to dashboard if already logged in */}
          <Route path="/login"           element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/register"        element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
          <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />
          <Route path="/verify-otp"      element={<PublicOnlyRoute><VerifyOTP /></PublicOnlyRoute>} />
          <Route path="/reset-password"  element={<PublicOnlyRoute><ResetPassword /></PublicOnlyRoute>} />

          {/* Protected platform routes – all wrapped inside AppShell (sidebar + topbar) */}
          <Route path="/app" element={<PrivateRoute><AppShell /></PrivateRoute>}>
            <Route index               element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"    element={<Dashboard />} />
            <Route path="profile"      element={<Profile />} />
            <Route path="about"        element={<AboutXephora />} />
            <Route path="modes"        element={<ModesHub />} />
            <Route path="memory"       element={<MemoryNexus />} />
            <Route path="logic"        element={<LogicArena />} />
            <Route path="number-rush"  element={<NumberRush />} />
            <Route path="strategy"     element={<StrategyZone />} />
            <Route path="multiplayer"  element={<MultiplayerArena />} />
            <Route path="ai-engine"    element={<AINeuralEngine />} />
            <Route path="analytics"    element={<SkillAnalytics />} />
            <Route path="leaderboard"  element={<Leaderboard />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="community"    element={<CommunityHub />} />
            <Route path="tournaments"  element={<Tournaments />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="plans"        element={<PremiumPlans />} />
            <Route path="settings"     element={<Settings />} />
            <Route path="support"      element={<HelpSupport />} />
            <Route path="faq"          element={<FAQ />} />
            <Route path="contact"      element={<Contact />} />
            <Route path="admin"        element={<AdminRoute><AdminPanel /></AdminRoute>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
