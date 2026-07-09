import { useToast } from '../context/ToastContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function SiparisOlustur() {
  const [eczaneler, setEczaneler] = useState([]);
  const [ilaclar, setIlaclar] = useState([]);
  const [seciliEczane, setSeciliEczane] = useState('');
  const [urunler, setUrunler] = useState([{ ilac: '', miktar: 1 }]);
  const [hata, setHata] = useState('');
  const navigate = useNavigate();
  const showToast = useToast();

  useEffect(() => {
    const verileriGetir = async () => {
      try {
        const [eczaneRes, ilacRes] = await Promise.all([
          api.get('/eczane'),
          api.get('/ilac')
        ]);
        setEczaneler(eczaneRes.data);
        setIlaclar(ilacRes.data);
      } catch (err) {
        console.error('Veriler getirilemedi:', err);
      }
    };
    verileriGetir();
  }, []);

  const urunEkle = () => {
    setUrunler([...urunler, { ilac: '', miktar: 1 }]);
  };

  const urunSil = (index) => {
    setUrunler(urunler.filter((_, i) => i !== index));
  };

  const urunDegistir = (index, alan, deger) => {
    const yeniUrunler = [...urunler];
    yeniUrunler[index][alan] = deger;
    setUrunler(yeniUrunler);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHata('');

    if (!seciliEczane) {
      setHata('Lütfen bir eczane seçin');
      return;
    }
    if (urunler.some((u) => !u.ilac)) {
      setHata('Lütfen tüm ürün satırlarında ilaç seçin');
      return;
    }

    try {
      await api.post('/siparis', {
        eczane: seciliEczane,
        urunler: urunler.map((u) => ({ ilac: u.ilac, miktar: Number(u.miktar) }))
      });
      showToast('Sipariş başarıyla oluşturuldu', 'success');
      setSeciliEczane('');
      setUrunler([{ ilac: '', miktar: 1 }]);
      navigate('/siparisler');
    } catch (err) {
      setHata(err.response?.data?.mesaj || 'Sipariş oluşturulurken bir hata oluştu');
    }
  };

  return (
    <div className="page" style={{ maxWidth: '600px' }}>
      <div className="page-header">
        <h2>Yeni Sipariş Oluştur</h2>
        <div className="header-actions">
          <button className="btn btn-ghost" onClick={() => navigate('/siparisler')}>← Listeye Dön</button>
        </div>
      </div>

      <div className="card" style={{ padding: '28px' }}>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Eczane</label>
            <select className="input" value={seciliEczane} onChange={(e) => setSeciliEczane(e.target.value)} required>
              <option value="">-- Eczane Seçin --</option>
              {eczaneler.map((e) => (
                <option key={e._id} value={e._id}>{e.eczaneAdi}</option>
              ))}
            </select>
          </div>

          <label className="label">Ürünler</label>
          {urunler.map((urun, index) => (
            <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
              <select
                className="input"
                value={urun.ilac}
                onChange={(e) => urunDegistir(index, 'ilac', e.target.value)}
                style={{ flex: 2 }}
                required
              >
                <option value="">-- İlaç Seçin --</option>
                {ilaclar.map((i) => (
                  <option key={i._id} value={i._id}>{i.ilacAdi} (Stok: {i.stokMiktari})</option>
                ))}
              </select>
              <input
                className="input"
                type="number"
                min="1"
                value={urun.miktar}
                onChange={(e) => urunDegistir(index, 'miktar', e.target.value)}
                style={{ flex: 1 }}
                required
              />
              {urunler.length > 1 && (
                <button type="button" className="btn btn-ghost" onClick={() => urunSil(index)}>✕</button>
              )}
            </div>
          ))}

          <button type="button" className="btn btn-secondary" onClick={urunEkle} style={{ marginBottom: '20px' }}>
            + Ürün Ekle
          </button>

          {hata && <div className="alert alert-error">{hata}</div>}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Siparişi Oluştur
          </button>
        </form>
      </div>
    </div>
  );
}

export default SiparisOlustur;
