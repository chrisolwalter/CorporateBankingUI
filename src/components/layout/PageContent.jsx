export function PageContent({ leftColumn, rightColumn }) {
  return (
    <section className="portal-page-content">
      <div className="portal-page-content__left">{leftColumn}</div>
      <div className="portal-page-content__right">{rightColumn}</div>
    </section>
  );
}
