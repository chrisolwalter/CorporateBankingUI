export function AppShell({ header, sidebar, children }) {
  return (
    <div className="app-shell">
      {sidebar}
      <div className="app-shell__workspace">
        {header}
        <main className="app-shell__content">{children}</main>
      </div>
    </div>
  );
}
