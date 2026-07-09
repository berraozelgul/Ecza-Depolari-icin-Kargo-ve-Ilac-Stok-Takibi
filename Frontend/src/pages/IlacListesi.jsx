import { useToast } from '../context/ToastContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function IlacListesi() {
  const [ilaclar, setIlaclar] = useState([]);
  const [arama, setArama] = useState('');
  const [yukleniyor, setYukleniyor] = useState(true);
  const navigate = useNavigate();
  const showToast = useToast();

  const ilaclariGetir = async () => {
    setYukleniyor(true);
    try {
      const params = {};
      if (arama) params.arama = arama;
      const response = await api.get('/ilac', { params });
      setIlaclar(response.data);
    } catch (err) {
      console.error('İlaçlar getirilemedi:', err);
    } finally {
      setYukleniyor(false);
    }
  };

  useEffect(() => {
    ilaclariGetir();
  }, []);

  const handleAramaSubmit = (e) => {
    e.preventDefault();
    ilaclariGetir();
  };

  const handleSil = async (id, ilacAdi) => {
    const emin = window.confirm(`${ilacAdi} ilacını silmek istediğine emin misin?`);
    if (!emin) return;

    try {
      await api.delete(`/ilac/${id}`);
      setIlaclar(ilaclar.filter((i) => i._id !== id));
      showToast('İlaç silindi', 'success');
    } catch (err) {
      showToast(err.response?.data?.mesaj || 'İlaç silinemedi', 'error');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>İlaç Stok Listesi</h2>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => navigate('/ilac-ekle')}>
            + Yeni İlaç
          </button>
        </div>
      </div>

      <form onSubmit={handleAramaSubmit} className="search-bar">
        <input
          type="text"
          className="input"
          placeholder="İlaç adı veya barkod ara..."
          value={arama}
          onChange={(e) => setArama(e.target.value)}
        />
        <button type="submit" className="btn btn-secondary">Ara</button>
      </form>

      <div className="card table-wrap">
        {yukleniyor ? (
          <div className="empty-state">Yükleniyor...</div>
        ) : ilaclar.length === 0 ? (
          <div className="empty-state">Kayıt bulunamadı.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>İlaç Adı</th>
                <th>Barkod</th>
                <th>Stok</th>
                <th>Kritik Seviye</th>
                <th>Son Kul. Tarihi</th>
                <th>Birim Fiyat</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ilaclar.map((ilac) => (
                <tr
                  key={ilac._id}
                  style={ilac.stokMiktari <= ilac.kritikStokSeviyesi ? { color: 'var(--color-danger)' } : {}}
                >
                  <td>{ilac.ilacAdi}</td>
                  <td>{ilac.barkod}</td>
                  <td>{ilac.stokMiktari}</td>
                  <td>{ilac.kritikStokSeviyesi}</td>
                  <td>{ilac.sonKullanmaTarihi ? new Date(ilac.sonKullanmaTarihi).toLocaleDateString('tr-TR') : '-'}</td>
                  <td>{ilac.birimFiyat} ₺</td>
                  <td>
                   <button
  className="btn-edit-text"
  onClick={() => navigate(`/ilac-duzenle/${ilac._id}`)}
>
  Düzenle
</button>
                    <button className="btn-danger-text" onClick={() => handleSil(ilac._id, ilac.ilacAdi)}>
                      Sil
                    </button>
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

export default IlacListesi;