export function PageIntro({
  kicker,
  title,
  description,
  actions = null,
  aside = null,
  className = '',
  compact = false,
}) {
  const rootClassName = ['ui-page-intro', compact ? 'ui-page-intro-compact' : '', className].filter(Boolean).join(' ');

  return (
    <section className={rootClassName}>
      <div className="ui-page-intro-copy">
        {kicker ? <p className="eyebrow ui-page-kicker">{kicker}</p> : null}
        <h1 className="ui-page-title">{title}</h1>
        {description ? <p className="muted ui-page-copy">{description}</p> : null}
        {actions ? <div className="ui-actions">{actions}</div> : null}
      </div>
      {aside ? <div className="ui-page-intro-aside">{aside}</div> : null}
    </section>
  );
}
