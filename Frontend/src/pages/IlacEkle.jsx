import { useToast } from '../context/ToastContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function IlacEkle() {
  const [form, setForm] = useState({
    ilacAdi: '',
    barkod: '',
    stokMiktari: 0,
    kritikStokSeviyesi: 10,
    sonKullanmaTarihi: '',
    birimFiyat: 0
  });
  const [hata, setHata] = useState('');
  const navigate = useNavigate();
  const showToast = useToast();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHata('');
    try {
      await api.post('/ilac', form);
      showToast('İlaç başarıyla eklendi', 'success');
      setForm({ ilacAdi: '', barkod: '', stokMiktari: 0, kritikStokSeviyesi: 10, sonKullanmaTarihi: '', birimFiyat: 0 });
    } catch (err) {
      setHata(err.response?.data?.mesaj || 'İlaç eklenirken bir hata oluştu');
    }
  };

  return (
    <div className="page" style={{ maxWidth: '520px' }}>
      <div className="page-header">
        <h2>Yeni İlaç Ekle</h2>
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
            Kaydet
          </button>
        </form>
      </div>
    </div>
  );
}

export default IlacEkle;
