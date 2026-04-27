import { NavLink } from 'react-router-dom';
import { Icon } from './icons.jsx';

export function Sidebar({ brand, links, collapsed, onToggleCollapse, onLogout }) {
  return (
    <aside className="sidebar" aria-label="Navigation principale">
      <div className="sidebar-header">
        <div className="sidebar-mark">SS</div>
        <div className="sidebar-brand">{brand}</div>
      </div>

      <div className="sidebar-section-label">Navigation</div>
      <nav className="sidebar-nav">
        {links.map((link) => {
          const IconCmp = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                'sidebar-link' + (isActive ? ' is-active' : '')
              }
              title={collapsed ? link.label : undefined}
            >
              <span className="sidebar-link-icon">{IconCmp ? <IconCmp /> : null}</span>
              <span className="sidebar-link-label">{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-collapse-btn"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Étendre' : 'Réduire'}
          title={collapsed ? 'Étendre' : 'Réduire'}
        >
          <span className="sidebar-link-icon">
            {collapsed ? <Icon.ChevronRight /> : <Icon.ChevronLeft />}
          </span>
          <span className="sidebar-link-label">Réduire</span>
        </button>
        <button
          type="button"
          className="sidebar-logout"
          onClick={onLogout}
          title="Déconnexion"
        >
          <span className="sidebar-link-icon"><Icon.Logout /></span>
          <span className="sidebar-link-label">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
