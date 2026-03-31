export function StateCard({
  title,
  description,
  icon = '--',
  iconClassName = 'state-icon',
  className = '',
  children = null,
}) {
  const rootClassName = ['content-card', 'state-card', 'ui-state-card', className].filter(Boolean).join(' ');

  return (
    <section className={rootClassName}>
      <div className={iconClassName}>{icon}</div>
      <div className="ui-state-copy">
        <h2>{title}</h2>
        {description ? <p className="muted">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
