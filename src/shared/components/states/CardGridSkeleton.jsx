export function CardGridSkeleton({ count = 4, className = '' }) {
  const items = Array.from({ length: count }, (_, index) => index);
  const rootClassName = ['ui-card-grid-skeleton', className].filter(Boolean).join(' ');

  return (
    <div className={rootClassName} aria-hidden="true">
      {items.map((item) => (
        <article key={item} className="ui-card-skeleton">
          <div className="ui-card-skeleton-row">
            <span className="ui-skeleton-block ui-skeleton-discount" />
            <span className="ui-skeleton-block ui-skeleton-status" />
          </div>
          <span className="ui-skeleton-block ui-skeleton-copy" />
          <div className="ui-card-skeleton-actions">
            <span className="ui-skeleton-block ui-skeleton-button" />
            <span className="ui-skeleton-block ui-skeleton-button" />
          </div>
        </article>
      ))}
    </div>
  );
}
