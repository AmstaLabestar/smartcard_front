import { NavLink } from 'react-router-dom';

export function MobileBottomNav({ links }) {
  return (
    <nav className="mobile-bottom-nav mobile-bottom-nav-v2" aria-label="Navigation mobile">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => (
            isActive
              ? 'mobile-bottom-link mobile-bottom-link-v2 mobile-bottom-link-active'
              : 'mobile-bottom-link mobile-bottom-link-v2'
          )}
        >
          <span className="mobile-bottom-link-dot" aria-hidden="true" />
          <span className="mobile-bottom-link-label">{link.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
