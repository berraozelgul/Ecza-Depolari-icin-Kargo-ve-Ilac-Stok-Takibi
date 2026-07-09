import { useToast } from '../context/ToastContext';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

function IlacDuzenle() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [hata, setHata] = useState('');
  const navigate = useNavigate();
  const showToast = useToast();

  useEffect(() => {
    api.get(`/ilac/${id}`).then((res) => {
      const ilac = res.data;
      setForm({
        ilacAdi: ilac.ilacAdi || '',
        barkod: ilac.barkod || '',
        stokMiktari: ilac.stokMiktari ?? 0,
        kritikStokSeviyesi: ilac.kritikStokSeviyesi ?? 10,
        sonKullanmaTarihi: ilac.sonKullanmaTarihi ? ilac.sonKullanmaTarihi.slice(0, 10) : '',
        birimFiyat: ilac.birimFiyat ?? 0
      });
    }).catch(() => setHata('İlaç bilgileri getirilemedi'));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHata('');
    try {
      await api.put(`/ilac/${id}`, form);
      showToast('İlaç güncellendi', 'success');
      navigate('/ilaclar');
    } catch (err) {
      setHata(err.response?.data?.mesaj || 'Güncelleme başarısız');
    }
  };

  if (!form) {
    return <div className="page"><div className="empty-state">{hata || 'Yükleniyor...'}</div></div>;
  }

  return (
    <div className="page" style={{ maxWidth: '520px' }}>
      <div className="page-header">
        <h2>İlaç Düzenle</h2>
        <div className="header-actions">
          <button className="btn btn-ghost" onClick={() => navigate('/ilaclar')}>← Listeye Dön</button>
        </div>
      </div>

      <div className="card" style={{ padding: '28px' }}>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">İlaç Adı</label>
            <input className="input" type="text" name="ilacAdi" value={form.ilacAdi} onChange={handleChange} required />
          </div>
          <div className="field">
            <label className="label">Barkod</label>
            <input className="input" type="text" name="barkod" value={form.barkod} onChange={handleChange} />
          </div>
          <div className="field">
            <label className="label">Stok Miktarı</label>
            <input className="input" type="number" name="stokMiktari" value={form.stokMiktari} onChange={handleChange} />
          </div>
          <div className="field">
            <label className="label">Kritik Stok Seviyesi</label>
            <input className="input" type="number" name="kritikStokSeviyesi" value={form.kritikStokSeviyesi} onChange={handleChange} />
          </div>
          <div className="field">
            <label className="label">Son Kullanma Tarihi</label>
            <input className="input" type="date" name="sonKullanmaTarihi" value={form.sonKullanmaTarihi} onChange={handleChange} />
          </div>
          <div className="field">
            <label className="label">Birim Fiyat</label>
            <input className="input" type="number" step="0.01" name="birimFiyat" value={form.birimFiyat} onChange={handleChange} />
          </div>

          {hata && <div className="alert alert-error">{hata}</div>}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Güncelle
          </button>
        </form>
      </div>
    </div>
  );
}

export default IlacDuzenle;