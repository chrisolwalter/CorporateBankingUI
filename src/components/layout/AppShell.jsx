export function AppShell({ header, sidebar, children }) {
  return (
    <div className="app-shell">
      {header}
      <div className="app-shell__body">
        {sidebar}
        <main className="app-shell__content">{children}</main>
      </div>
    </div>
  );
}
