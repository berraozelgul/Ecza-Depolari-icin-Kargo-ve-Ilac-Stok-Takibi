import { useToast } from '../context/ToastContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function KargoEkle() {
  const [form, setForm] = useState({
    takipNo: '',
    gonderen: '',
    alici: '',
    adres: '',
    durum: 'Hazırlanıyor'
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
      await api.post('/kargo', form);
      showToast('Kargo başarıyla eklendi', 'success');
      setForm({ takipNo: '', gonderen: '', alici: '', adres: '', durum: 'Hazırlanıyor' });
    } catch (err) {
      setHata(err.response?.data?.mesaj || 'Kargo eklenirken bir hata oluştu');
    }
  };

  return (
    <div className="page" style={{ maxWidth: '520px' }}>
      <div className="page-header">
        <h2>Yeni Kargo Ekle</h2>
        <div className="header-actions">
          <button className="btn btn-ghost" onClick={() => navigate('/kargolar')}>← Listeye Dön</button>
        </div>
      </div>

      <div className="card" style={{ padding: '28px' }}>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Takip No</label>
            <input className="input" type="text" name="takipNo" value={form.takipNo} onChange={handleChange} required />
          </div>
          <div className="field">
            <label className="label">Gönderen</label>
            <input className="input" type="text" name="gonderen" value={form.gonderen} onChange={handleChange} required />
          </div>
          <div className="field">
            <label className="label">Alıcı</label>
            <input className="input" type="text" name="alici" value={form.alici} onChange={handleChange} required />
          </div>
          <div className="field">
            <label className="label">Adres</label>
            <input className="input" type="text" name="adres" value={form.adres} onChange={handleChange} required />
          </div>
          <div className="field">
            <label className="label">Durum</label>
            <select className="select" name="durum" value={form.durum} onChange={handleChange}>
              <option value="Hazırlanıyor">Hazırlanıyor</option>
              <option value="Kargoya Verildi">Kargoya Verildi</option>
              <option value="Yolda">Yolda</option>
              <option value="Dağıtımda">Dağıtımda</option>
              <option value="Teslim Edildi">Teslim Edildi</option>
              <option value="İptal">İptal</option>
            </select>
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

export default KargoEkle;
