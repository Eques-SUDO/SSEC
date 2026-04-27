import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from './Toast.jsx';

const COLLAPSE_KEY = 'ssec.sidebar.collapsed';
const ROLE_LABEL = { direction: 'Direction', employe: 'Employé', admin_it: 'Admin IT' };

export function DashboardLayout({ title, links, children }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSE_KEY) === '1');

  useEffect(() => {
    localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0');
  }, [collapsed]);

  function handleLogout() {
    logout();
    toast.info('Déconnecté', 'À bientôt.');
    navigate('/login', { replace: true });
  }

  const initials = user
    ? `${(user.prenom?.[0] ?? '').toUpperCase()}${(user.nom?.[0] ?? '').toUpperCase()}`
    : '··';

  return (
    <div className={'dashboard' + (collapsed ? ' is-collapsed' : '')}>
      <Sidebar
        brand="SSEC"
        links={links}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        onLogout={handleLogout}
      />

      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1>{title}</h1>
          <div className="dashboard-header-meta">
            {user && (
              <div className="dashboard-user">
                <div className="dashboard-user-avatar">{initials}</div>
                <div className="dashboard-user-meta">
                  <strong>{user.prenom} {user.nom}</strong>
                  <span>{ROLE_LABEL[user.role] ?? user.role}</span>
                </div>
              </div>
            )}
          </div>
        </header>

        <section className="dashboard-content">{children}</section>
      </div>
    </div>
  );
}

/* re-exported for legacy callers */
export function ChartPlaceholder({ label, sub }) {
  return (
    <div className="chart-card">
      <div className="chart-card-head">
        <div>
          <div className="chart-card-title">{label}</div>
          {sub && <div className="chart-card-sub">{sub}</div>}
        </div>
      </div>
      <div className="chart-card-body">
        <div className="chart-skeleton" aria-label="placeholder graphique" />
      </div>
    </div>
  );
}
