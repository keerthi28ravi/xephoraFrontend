import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  {
    title: 'PORTAL MODULES',
    items: [
      { icon: '⚡', label: 'Dashboard',   to: '/app/dashboard' },
      { icon: '👤', label: 'Profile',     to: '/app/profile' },
      { icon: '👁️', label: 'About Nexus', to: '/app/about' },
      { icon: '⛩️', label: 'Game Modes',  to: '/app/modes' },
    ],
  },
  {
    title: 'GAMING ARENAS',
    items: [
      { icon: '🧠', label: 'Memory Nexus',    to: '/app/memory' },
      { icon: '🧩', label: 'Logic Arena',     to: '/app/logic' },
      { icon: '🔢', label: 'Number Rush',     to: '/app/number-rush' },
      { icon: '🛡️', label: 'Strategy Zone',   to: '/app/strategy' },
      { icon: '📡', label: 'Multiplayer',     to: '/app/multiplayer' },
    ],
  },
  {
    title: 'COGNITIVE ENGINE',
    items: [
      { icon: '🌐', label: 'AI Neural Engine', to: '/app/ai-engine' },
      { icon: '📈', label: 'Skill Analytics',  to: '/app/analytics' },
      { icon: '📊', label: 'Leaderboard',      to: '/app/leaderboard' },
      { icon: '🎖️', label: 'Achievements',     to: '/app/achievements' },
    ],
  },
  {
    title: 'GLOBAL LEAGUES',
    items: [
      { icon: '👥', label: 'Community Hub', to: '/app/community' },
      { icon: '⚔️', label: 'Tournaments',   to: '/app/tournaments' },
      { icon: '🔔', label: 'Notifications', to: '/app/notifications' },
    ],
  },
  {
    title: 'SYSTEM PROTOCOLS',
    items: [
      { icon: '💎', label: 'Premium Plans', to: '/app/plans' },
      { icon: '⚙️', label: 'Settings',      to: '/app/settings' },
      { icon: '💬', label: 'Help & Support',to: '/app/support' },
      { icon: '❓', label: 'FAQ',           to: '/app/faq' },
      { icon: '📩', label: 'Contact',       to: '/app/contact' },
    ],
  },
];

export default function Sidebar({ isOpen, onToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className="sidebar"
      style={{ width: isOpen ? '280px' : '0', overflow: 'hidden', flexShrink: 0 }}
    >
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" fill="none" stroke="#00f0ff" strokeWidth="6" />
            <circle cx="50" cy="50" r="15" fill="#7000ff" />
          </svg>
          <span className="logo-text">XEPHORA</span>
        </div>
        <button className="sidebar-toggle-btn" onClick={onToggle} aria-label="Toggle Sidebar">
          <span /><span /><span />
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV.map((group) => (
          <div className="nav-group" key={group.title}>
            <div className="nav-group-title">{group.title}</div>
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}

        {/* Admin link visible only to admins */}
        {user?.role === 'ADMIN' && (
          <div className="nav-group">
            <div className="nav-group-title">ADMIN MATRIX</div>
            <NavLink to="/app/admin" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
              <span className="nav-icon">🔐</span>
              <span className="nav-label">Admin Panel</span>
            </NavLink>
          </div>
        )}
      </nav>

      {/* User brief + logout */}
      <div className="sidebar-user-brief">
        <div className="user-brief-avatar">
          <div className="avatar-glow" />
          <span className="avatar-initials">
            {user?.username?.slice(0, 2).toUpperCase() || 'XP'}
          </span>
        </div>
        <div className="user-brief-info" style={{ flex: 1 }}>
          <div className="user-brief-name">{user?.username || 'OPERATOR'}</div>
          <div className="user-brief-rank">LEVEL {user?.level || 1}</div>
        </div>
        <button
          onClick={handleLogout}
          title="Logout"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '16px', color: 'var(--text-muted)',
            transition: 'color .2s',
          }}
          onMouseEnter={e => e.target.style.color = '#ff007b'}
          onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
        >
          ⏻
        </button>
      </div>
    </aside>
  );
}
