export function Sidebar({ collapsed, onToggle }) {
  return (
    <aside className={`portal-sidebar ${collapsed ? "portal-sidebar--collapsed" : ""}`}>
      <div className="portal-sidebar__brand">
        <span className="portal-sidebar__brand-mark">CB</span>
        {!collapsed && (
          <div>
            <p>Corporate Banking</p>
            <strong>Trading Portal</strong>
          </div>
        )}
      </div>

      <button
        className="portal-sidebar__toggle"
        type="button"
        onClick={onToggle}
        aria-expanded={!collapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <span aria-hidden="true">☰</span>
        {!collapsed && <span>Collapse</span>}
      </button>

      <nav className="portal-sidebar__menu" aria-label="primary navigation">
        {!collapsed && <p className="portal-sidebar__section-title">Payments</p>}
        <button className="portal-sidebar__item portal-sidebar__item--active" type="button">
          <span className="portal-sidebar__item-icon">$</span>
          {!collapsed && <span>Single Payments</span>}
        </button>
      </nav>
    </aside>
  );
}
