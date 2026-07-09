import { useToast } from '../context/ToastContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const DURUMLAR = ['Hazırlanıyor', 'Kargoya Verildi', 'Yolda', 'Dağıtımda', 'Teslim Edildi', 'İptal'];

function KargoListesi() {
  const [kargolar, setKargolar] = useState([]);
  const [arama, setArama] = useState('');
  const [durumFiltre, setDurumFiltre] = useState('');
  const [yukleniyor, setYukleniyor] = useState(true);
  const navigate = useNavigate();
  const showToast = useToast();

  const kargolariGetir = async () => {
    setYukleniyor(true);
    try {
      const params = {};
      if (arama) params.arama = arama;
      if (durumFiltre) params.durum = durumFiltre;

      const response = await api.get('/kargo', { params });
      setKargolar(response.data);
    } catch (err) {
      console.error('Kargolar getirilemedi:', err);
    } finally {
      setYukleniyor(false);
    }
  };

  useEffect(() => {
    kargolariGetir();
  }, []);

  const handleAramaSubmit = (e) => {
    e.preventDefault();
    kargolariGetir();
  };

  const handleDurumDegistir = async (id, yeniDurum) => {
    try {
      await api.put(`/kargo/${id}`, { durum: yeniDurum });
      setKargolar(kargolar.map((k) => (k._id === id ? { ...k, durum: yeniDurum } : k)));
      showToast('Durum güncellendi', 'success');
    } catch (err) {
      showToast(err.response?.data?.mesaj || 'Durum güncellenemedi', 'error');
    }
  };

  const handleSil = async (id, takipNo) => {
    const emin = window.confirm(`${takipNo} numaralı kargoyu silmek istediğine emin misin?`);
    if (!emin) return;

    try {
      await api.delete(`/kargo/${id}`);
      setKargolar(kargolar.filter((k) => k._id !== id));
      showToast('Kargo silindi', 'success');
    } catch (err) {
      showToast(err.response?.data?.mesaj || 'Kargo silinemedi', 'error');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Kargo Listesi</h2>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => navigate('/kargo-ekle')}>
            + Yeni Kargo
          </button>
        </div>
      </div>

      <form onSubmit={handleAramaSubmit} className="search-bar">
        <input
          type="text"
          className="input"
          placeholder="Takip no, gönderen veya alıcı ara..."
          value={arama}
          onChange={(e) => setArama(e.target.value)}
        />
        <select
          className="select"
          value={durumFiltre}
          onChange={(e) => setDurumFiltre(e.target.value)}
        >
          <option value="">Tüm Durumlar</option>
          {DURUMLAR.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-secondary">Ara</button>
      </form>

      <div className="card table-wrap">
        {yukleniyor ? (
          <div className="empty-state">Yükleniyor...</div>
        ) : kargolar.length === 0 ? (
          <div className="empty-state">Kayıt bulunamadı.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Takip No</th>
                <th>Gönderen</th>
                <th>Alıcı</th>
                <th>Adres</th>
                <th>Durum</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {kargolar.map((kargo) => (
                <tr key={kargo._id} data-durum={kargo.durum}>
                  <td>{kargo.takipNo}</td>
                  <td>{kargo.gonderen}</td>
                  <td>{kargo.alici}</td>
                  <td>{kargo.adres}</td>
                  <td>
                    <select
                      className="select"
                      value={kargo.durum}
                      onChange={(e) => handleDurumDegistir(kargo._id, e.target.value)}
                      style={{ width: 'auto', padding: '5px 8px', fontSize: '13px' }}
                    >
                      {DURUMLAR.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn-danger-text"
                      onClick={() => handleSil(kargo._id, kargo.takipNo)}
                    >
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

export default KargoListesi;
