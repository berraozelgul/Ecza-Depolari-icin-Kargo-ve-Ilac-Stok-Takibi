import { useToast } from '../context/ToastContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function SiparisListesi() {
  const [siparisler, setSiparisler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [onaylananId, setOnaylananId] = useState(null);
  const navigate = useNavigate();
  const showToast = useToast();

  const siparisleriGetir = async () => {
    setYukleniyor(true);
    try {
      const response = await api.get('/siparis');
      setSiparisler(response.data);
    } catch (err) {
      console.error('Siparişler getirilemedi:', err);
    } finally {
      setYukleniyor(false);
    }
  };

  useEffect(() => {
    siparisleriGetir();
  }, []);

  const siparisiOnayla = async (id) => {
    setOnaylananId(id);
    try {
      const response = await api.put(`/siparis/${id}/onayla`);
      showToast(`Sipariş onaylandı! Takip No: ${response.data.kargo.takipNo}`, 'success');
      siparisleriGetir();
    } catch (err) {
      showToast(err.response?.data?.mesaj || 'Sipariş onaylanırken hata oluştu', 'error');
    } finally {
      setOnaylananId(null);
    }
  };

  const durumRengi = (durum) => {
    if (durum === 'Beklemede') return { color: '#b8860b' };
    if (durum === 'Sevk Edildi') return { color: 'green' };
    if (durum === 'İptal') return { color: 'crimson' };
    return {};
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Sipariş Listesi</h2>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => navigate('/siparis-olustur')}>
            + Yeni Sipariş
          </button>
        </div>
      </div>

      <div className="card table-wrap">
        {yukleniyor ? (
          <div className="empty-state">Yükleniyor...</div>
        ) : siparisler.length === 0 ? (
          <div className="empty-state">Kayıt bulunamadı.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Eczane</th>
                <th>Ürün Sayısı</th>
                <th>Durum</th>
                <th>Tarih</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {siparisler.map((siparis) => (
                <tr key={siparis._id}>
                  <td>{siparis.eczane?.eczaneAdi || '—'}</td>
                  <td>{siparis.urunler.length}</td>
                  <td style={durumRengi(siparis.durum)}>{siparis.durum}</td>
                  <td>{new Date(siparis.createdAt).toLocaleDateString('tr-TR')}</td>
                  <td>
                    {siparis.durum === 'Beklemede' ? (
                      <button
                        className="btn btn-primary"
                        onClick={() => siparisiOnayla(siparis._id)}
                        disabled={onaylananId === siparis._id}
                      >
                        {onaylananId === siparis._id ? 'Onaylanıyor...' : 'Onayla ve Sevk Et'}
                      </button>
                    ) : (
                      <span style={{ color: '#888' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default SiparisListesi;
