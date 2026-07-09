import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useTheme } from '../hooks/useTheme';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hata, setHata] = useState('');
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHata('');

    try {
      const response = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('role', response.data.role);
      navigate('/dashboard');
    } catch (err) {
      setHata(err.response?.data?.mesaj || 'Giriş başarısız');
    }
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <button className="btn btn-ghost theme-toggle" onClick={toggleTheme} type="button" style={{ float: 'right' }}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <div className="login-eyebrow">Ecza Deposu</div>
        <h2>Personel Girişi</h2>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Kullanıcı adı</label>
            <input
              type="text"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="label">Şifre</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {hata && <div className="alert alert-error">{hata}</div>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Giriş Yap
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link to="/" style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            ← Kargo sorgulama sayfasına dön
          </Link>
        </div>
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <Link to="/kayit" style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            Hesabın yok mu? Kayıt ol
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
