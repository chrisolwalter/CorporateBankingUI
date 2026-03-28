export function Sidebar({ collapsed, onToggle }) {
  return (
    <aside className={`portal-sidebar ${collapsed ? "portal-sidebar--collapsed" : ""}`}>
      <button className="portal-sidebar__toggle" type="button" onClick={onToggle}>
        {collapsed ? "Expand" : "Collapse"}
      </button>

      <nav className="portal-sidebar__menu" aria-label="primary navigation">
        <p className="portal-sidebar__section-title">Payments</p>
        <button className="portal-sidebar__item portal-sidebar__item--active" type="button">
          <span className="portal-sidebar__item-icon">$</span>
          {!collapsed && <span>Single Payments</span>}
        </button>
      </nav>
    </aside>
  );
}
