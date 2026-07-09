import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useTheme } from '../hooks/useTheme';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('personel');
  const [hata, setHata] = useState('');
  const [basarili, setBasarili] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHata('');
    try {
      await api.post('/auth/register', { username, password, role });
      setBasarili(true);
      setTimeout(() => navigate('/giris'), 1200);
    } catch (err) {
      setHata(err.response?.data?.mesaj || 'Kayıt başarısız');
    }
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <button className="btn btn-ghost theme-toggle" onClick={toggleTheme} type="button" style={{ float: 'right' }}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <div className="login-eyebrow">Ecza Deposu</div>
        <h2>Kayıt Ol</h2>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Kullanıcı adı</label>
            <input type="text" className="input" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="field">
            <label className="label">Şifre</label>
            <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="field">
            <label className="label">Hesap Türü</label>
            <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="personel">Depo Personeli</option>
              <option value="eczane">Eczane</option>
            </select>
          </div>

          {hata && <div className="alert alert-error">{hata}</div>}
          {basarili && <div className="alert alert-success">Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...</div>}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Kayıt Ol
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link to="/giris" style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            Zaten hesabın var mı? Giriş yap
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
