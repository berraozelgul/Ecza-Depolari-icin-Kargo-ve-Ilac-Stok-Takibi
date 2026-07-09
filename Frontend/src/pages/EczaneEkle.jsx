import { useToast } from '../context/ToastContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function EczaneEkle() {
  const [form, setForm] = useState({
    eczaneAdi: '',
    yetkiliKisi: '',
    telefon: '',
    adres: '',
    vergiNo: ''
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
      await api.post('/eczane', form);
      showToast('Eczane başarıyla eklendi', 'success');
      setForm({ eczaneAdi: '', yetkiliKisi: '', telefon: '', adres: '', vergiNo: '' });
    } catch (err) {
      setHata(err.response?.data?.mesaj || 'Eczane eklenirken bir hata oluştu');
    }
  };

  return (
    <div className="page" style={{ maxWidth: '520px' }}>
      <div className="page-header">
        <h2>Yeni Eczane Ekle</h2>
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
            Kaydet
          </button>
        </form>
      </div>
    </div>
  );
}

export default EczaneEkle;
