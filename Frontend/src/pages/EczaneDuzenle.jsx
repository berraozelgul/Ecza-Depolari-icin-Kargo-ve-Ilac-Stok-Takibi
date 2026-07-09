import { useToast } from '../context/ToastContext';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

function EczaneDuzenle() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [hata, setHata] = useState('');
  const navigate = useNavigate();
  const showToast = useToast();

  useEffect(() => {
    api.get(`/eczane/${id}`).then((res) => {
      const e = res.data;
      setForm({
        eczaneAdi: e.eczaneAdi || '',
        yetkiliKisi: e.yetkiliKisi || '',
        telefon: e.telefon || '',
        adres: e.adres || '',
        vergiNo: e.vergiNo || ''
      });
    }).catch(() => setHata('Eczane bilgileri getirilemedi'));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHata('');
    try {
      await api.put(`/eczane/${id}`, form);
      showToast('Eczane güncellendi', 'success');
      navigate('/eczaneler');
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
        <h2>Eczane Düzenle</h2>
        <div className="header-actions">
          <button className="btn btn-ghost" onClick={() => navigate('/eczaneler')}>← Listeye Dön</button>
        </div>
      </div>

      <div className="card" style={{ padding: '28px' }}>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Eczane Adı</label>
            <input className="input" type="text" name="eczaneAdi" value={form.eczaneAdi} onChange={handleChange} required />
          </div>
          <div className="field">
            <label className="label">Yetkili Kişi</label>
            <input className="input" type="text" name="yetkiliKisi" value={form.yetkiliKisi} onChange={handleChange} />
          </div>
          <div className="field">
            <label className="label">Telefon</label>
            <input className="input" type="text" name="telefon" value={form.telefon} onChange={handleChange} />
          </div>
          <div className="field">
            <label className="label">Adres</label>
            <input className="input" type="text" name="adres" value={form.adres} onChange={handleChange} required />
          </div>
          <div className="field">
            <label className="label">Vergi No</label>
            <input className="input" type="text" name="vergiNo" value={form.vergiNo} onChange={handleChange} />
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

export default EczaneDuzenle;