import { useToast } from '../context/ToastContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function EczaneListesi() {
  const [eczaneler, setEczaneler] = useState([]);
  const [arama, setArama] = useState('');
  const [yukleniyor, setYukleniyor] = useState(true);
  const navigate = useNavigate();
  const showToast = useToast();

  const eczaneleriGetir = async () => {
    setYukleniyor(true);
    try {
      const params = {};
      if (arama) params.arama = arama;
      const response = await api.get('/eczane', { params });
      setEczaneler(response.data);
    } catch (err) {
      console.error('Eczaneler getirilemedi:', err);
    } finally {
      setYukleniyor(false);
    }
  };

  useEffect(() => {
    eczaneleriGetir();
  }, []);

  const handleAramaSubmit = (e) => {
    e.preventDefault();
    eczaneleriGetir();
  };

  const handleSil = async (id, eczaneAdi) => {
    const emin = window.confirm(`${eczaneAdi} kaydını silmek istediğine emin misin?`);
    if (!emin) return;

    try {
      await api.delete(`/eczane/${id}`);
      setEczaneler(eczaneler.filter((e) => e._id !== id));
      showToast('Eczane silindi', 'success');
    } catch (err) {
      showToast(err.response?.data?.mesaj || 'Eczane silinemedi', 'error');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Eczaneler</h2>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => navigate('/eczane-ekle')}>
            Yeni Eczane
          </button>
        </div>
      </div>

      <form onSubmit={handleAramaSubmit} className="search-bar">
        <input
          type="text"
          className="input"
          placeholder="Eczane adı veya yetkili kişi ara..."
          value={arama}
          onChange={(e) => setArama(e.target.value)}
        />
        <button type="submit" className="btn btn-secondary">Ara</button>
      </form>

      <div className="card table-wrap">
        {yukleniyor ? (
          <div className="empty-state">Yükleniyor...</div>
        ) : eczaneler.length === 0 ? (
          <div className="empty-state">Kayıt bulunamadı.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Eczane Adı</th>
                <th>Yetkili Kişi</th>
                <th>Telefon</th>
                <th>Adres</th>
                <th>Vergi No</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {eczaneler.map((eczane) => (
                <tr key={eczane._id}>
                  <td>{eczane.eczaneAdi}</td>
                  <td>{eczane.yetkiliKisi || '-'}</td>
                  <td>{eczane.telefon || '-'}</td>
                  <td>{eczane.adres}</td>
                  <td>{eczane.vergiNo || '-'}</td>
                  <td>
                    <button
  className="btn-edit-text"
  onClick={() => navigate(`/eczane-duzenle/${eczane._id}`)}
>
  Düzenle
</button>
                    <button className="btn-danger-text" onClick={() => handleSil(eczane._id, eczane.eczaneAdi)}>
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

export default EczaneListesi;