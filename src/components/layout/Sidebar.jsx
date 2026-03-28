export function Sidebar({ collapsed, onToggle, labels }) {
  return (
    <aside className={`portal-sidebar ${collapsed ? "portal-sidebar--collapsed" : ""}`}>
      <div className="portal-sidebar__brand">
        <span className="portal-sidebar__brand-mark">CB</span>
        {!collapsed && (
          <div>
            <p>{labels.corporateBanking}</p>
            <strong>{labels.tradingPortal}</strong>
          </div>
        )}
      </div>

      <button
        className="portal-sidebar__collapse-icon"
        type="button"
        onClick={onToggle}
        aria-expanded={!collapsed}
        aria-label={collapsed ? labels.expandSidebar : labels.collapseSidebar}
      >
        <span aria-hidden="true">☰</span>
        <span aria-hidden="true">{collapsed ? "›" : "‹"}</span>
      </button>

      <nav className="portal-sidebar__menu" aria-label={labels.primaryNavigation}>
        {!collapsed && <p className="portal-sidebar__section-title">{labels.payments}</p>}
        <button
          className="portal-sidebar__item portal-sidebar__item--active"
          type="button"
          title={collapsed ? labels.singlePayments : undefined}
        >
          <span className="portal-sidebar__item-icon">$</span>
          {!collapsed && <span>{labels.singlePayments}</span>}
        </button>
      </nav>
    </aside>
  );
}
