export function MerchantStatsSkeleton() {
  return (
    <div className="merchant-stats-skeleton" aria-hidden="true">
      <section className="ui-stat-strip merchant-stats-strip merchant-stats-skeleton-strip">
        {Array.from({ length: 3 }, (_, index) => (
          <article key={index} className="ui-stat-pill merchant-stats-skeleton-pill">
            <span className="ui-skeleton-block merchant-stats-skeleton-label" />
            <span className="ui-skeleton-block merchant-stats-skeleton-value" />
            <span className="ui-skeleton-block merchant-stats-skeleton-copy" />
          </article>
        ))}
      </section>

      <section className="content-card premium-support-card merchant-stats-skeleton-filters">
        <div className="filter-chips merchant-stats-skeleton-chip-row">
          {Array.from({ length: 3 }, (_, index) => (
            <span key={index} className="ui-skeleton-block merchant-stats-skeleton-chip" />
          ))}
        </div>
      </section>

      <section className="content-card premium-support-card merchant-stats-skeleton-list-shell">
        <div className="merchant-stats-skeleton-head">
          <div className="merchant-stats-skeleton-copy-group">
            <span className="ui-skeleton-block merchant-stats-skeleton-label" />
            <span className="ui-skeleton-block merchant-stats-skeleton-title" />
          </div>
          <span className="ui-skeleton-block merchant-stats-skeleton-count" />
        </div>

        <div className="list-stack merchant-stats-list">
          {Array.from({ length: 3 }, (_, index) => (
            <article key={index} className="list-item merchant-stats-item merchant-stats-skeleton-item">
              <div className="merchant-stats-item-main">
                <span className="ui-skeleton-block merchant-stats-skeleton-line" />
                <span className="ui-skeleton-block merchant-stats-skeleton-subline" />
              </div>
              <div className="merchant-stats-item-values">
                <span className="ui-skeleton-block merchant-stats-skeleton-line" />
                <span className="ui-skeleton-block merchant-stats-skeleton-subline" />
                <span className="ui-skeleton-block merchant-stats-skeleton-subline" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
