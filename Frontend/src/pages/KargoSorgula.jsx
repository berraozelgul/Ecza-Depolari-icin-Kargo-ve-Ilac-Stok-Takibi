import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useTheme } from '../hooks/useTheme';

function KargoSorgula() {
  const [takipNo, setTakipNo] = useState('');
  const [kargo, setKargo] = useState(null);
  const [hata, setHata] = useState('');
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHata('');
    setKargo(null);

    try {
      const response = await api.get(`/kargo/${takipNo.trim()}`);
      setKargo(response.data);
    } catch (err) {
      setHata(err.response?.data?.mesaj || 'Kargo bulunamadı');
    }
  };

  return (
    <div className="login-shell">
      <div className="login-card" style={{ maxWidth: '440px' }}>
        <button className="btn btn-ghost theme-toggle" onClick={toggleTheme} type="button" style={{ float: 'right' }}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <div className="login-eyebrow">Ecza Deposu</div>
        <h2>Kargo Sorgula</h2>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Takip Numarası</label>
            <input
              type="text"
              className="input"
              placeholder="Örn: KRG001"
              value={takipNo}
              onChange={(e) => setTakipNo(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Sorgula
          </button>
        </form>

        {hata && <div className="alert alert-error" style={{ marginTop: '16px' }}>{hata}</div>}

        {kargo && (
          <div className="card" style={{ marginTop: '20px', padding: '18px' }}>
            <span className="status-badge" data-durum={kargo.durum} style={{ marginBottom: '12px' }}>
              {kargo.durum}
            </span>
            <p style={{ margin: '10px 0 4px' }}><strong>Takip No:</strong> {kargo.takipNo}</p>
            <p style={{ margin: '4px 0' }}><strong>Gönderen:</strong> {kargo.gonderen}</p>
            <p style={{ margin: '4px 0' }}><strong>Alıcı:</strong> {kargo.alici}</p>
            <p style={{ margin: '4px 0' }}><strong>Adres:</strong> {kargo.adres}</p>
          </div>
        )}

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link to="/giris" style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            Personel Girişi →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default KargoSorgula;