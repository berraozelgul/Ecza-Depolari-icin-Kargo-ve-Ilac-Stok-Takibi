import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/');
  };

  const linkClass = ({ isActive }) => 'nav-link' + (isActive ? ' nav-link-active' : '');

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">KargoTakip</div>
        <div className="navbar-links">
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
          {role === 'personel' && (
            <NavLink to="/kargolar" className={linkClass}>Kargolar</NavLink>
          )}
          {role === 'personel' && (
            <NavLink to="/ilaclar" className={linkClass}>İlaç Stok</NavLink>
          )}
          {role === 'personel' && (
            <NavLink to="/eczaneler" className={linkClass}>Eczaneler</NavLink>
          )}
          <NavLink to="/siparisler" className={linkClass}>Siparişler</NavLink>
        </div>
        <div className="navbar-actions">
          <button className="btn btn-ghost theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className="btn btn-ghost" onClick={handleLogout}>Çıkış Yap</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
