import { NavLink } from 'react-router-dom';

export function MobileBottomNav({ links }) {
  return (
    <nav className="mobile-bottom-nav" aria-label="Navigation mobile">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) => (isActive ? 'mobile-bottom-link mobile-bottom-link-active' : 'mobile-bottom-link')}
        >
          <span className="mobile-bottom-link-label">{link.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
