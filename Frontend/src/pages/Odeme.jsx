//kullanıcının göreceği ödeme ekranı
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../api/axios';

function Odeme() {
  const { siparisId } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();

  const [yukleniyor, setYukleniyor] = useState(true);
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [odemeBilgisi, setOdemeBilgisi] = useState(null);
  const [hata, setHata] = useState('');
  const [kartBilgisi, setKartBilgisi] = useState({
    adSoyad: '',
    kartNo: '',
    sonKullanma: '',
    cvv: '',
  });

  useEffect(() => {
    const baslat = async () => {
      try {
        const res = await api.post('/paytr/baslat', { siparisId });
        setOdemeBilgisi(res.data);
      } catch (err) {
        setHata(err.response?.data?.mesaj || 'Ödeme başlatılamadı');
      } finally {
        setYukleniyor(false);
      }
    };
    baslat();
  }, [siparisId]);

  // kart numarasını "1234 5678 9012 3456" gibi 4'erli gruplar halinde göstermek için
  const kartNoFormatla = (deger) => {
    const rakamlar = deger.replace(/\D/g, '').slice(0, 16);
    return rakamlar.replace(/(.{4})/g, '$1 ').trim();
  };

  const sonKullanmaFormatla = (deger) => {
    const rakamlar = deger.replace(/\D/g, '').slice(0, 4);
    if (rakamlar.length <= 2) return rakamlar;
    return `${rakamlar.slice(0, 2)}/${rakamlar.slice(2)}`;
  };

  const alanGuncelle = (alan, deger) => {
    setKartBilgisi({ ...kartBilgisi, [alan]: deger });
  };

  const tamamla = async (e) => {
    e.preventDefault();
    setGonderiliyor(true);
    try {
      await api.post('/paytr/mock-tamamla', {
        merchantOid: odemeBilgisi.merchantOid,
        basarili: true,
      });
      showToast('Ödeme başarılı', 'success');
      navigate('/siparisler');
    } catch (err) {
      showToast(err.response?.data?.mesaj || 'Ödeme sırasında hata oluştu', 'error');
    } finally {
      setGonderiliyor(false);
    }
  };

  if (yukleniyor) {
    return (
      <div className="page" style={{ maxWidth: '440px' }}>
        <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Ödeme hazırlanıyor…
        </div>
      </div>
    );
  }

  if (hata && !odemeBilgisi) {
    return (
      <div className="page" style={{ maxWidth: '440px' }}>
        <div className="alert alert-error">{hata}</div>
        <button className="btn btn-secondary" onClick={() => navigate('/siparisler')}>Siparişlere Dön</button>
      </div>
    );
  }

  return (
    <div className="page" style={{ maxWidth: '440px' }}>
      <div className="page-header">
        <h2>Ödeme</h2>
        <div className="header-actions">
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/siparisler')}>← Vazgeç</button>
        </div>
      </div>

      {/* Tutar özeti */}
      <div
        className="card"
        style={{
          padding: '24px 28px',
          marginBottom: '16px',
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
          border: 'none',
          color: '#fff',
        }}
      >
        <div style={{ fontSize: '13px', opacity: 0.75, marginBottom: '4px' }}>Ödenecek Tutar</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '34px', fontWeight: 700, letterSpacing: '-0.02em' }}>
          {odemeBilgisi.tutar.toFixed(2)} ₺
        </div>
        <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '10px' }}>
          Sipariş No: {odemeBilgisi.merchantOid}
        </div>
      </div>

      {/* Simülasyon uyarısı */}
      <div
        className="alert"
        style={{ background: '#FCF0DD', color: '#B4690E', marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}
      >
        <span>⚠</span>
        <span>Bu bir simülasyondur, gerçek kart bilgisi girilmiyor ve hiçbir yere gönderilmiyor.</span>
      </div>

      {/* Kart formu */}
      <div className="card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <span style={{ fontSize: '20px' }}>💳</span>
          <span style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>Kart Bilgileri</span>
        </div>

        <form onSubmit={tamamla}>
          <div className="field">
            <label className="label">Kart Sahibi</label>
            <input
              className="input"
              value={kartBilgisi.adSoyad}
              onChange={(e) => alanGuncelle('adSoyad', e.target.value)}
              placeholder="Ad Soyad"
              autoComplete="cc-name"
              required
            />
          </div>

          <div className="field">
            <label className="label">Kart Numarası</label>
            <input
              className="input"
              value={kartBilgisi.kartNo}
              onChange={(e) => alanGuncelle('kartNo', kartNoFormatla(e.target.value))}
              placeholder="•••• •••• •••• ••••"
              inputMode="numeric"
              autoComplete="cc-number"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="field" style={{ flex: 1 }}>
              <label className="label">Son Kullanma</label>
              <input
                className="input"
                value={kartBilgisi.sonKullanma}
                onChange={(e) => alanGuncelle('sonKullanma', sonKullanmaFormatla(e.target.value))}
                placeholder="AA/YY"
                inputMode="numeric"
                autoComplete="cc-exp"
                required
              />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label className="label">CVV</label>
              <input
                className="input"
                value={kartBilgisi.cvv}
                onChange={(e) => alanGuncelle('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="•••"
                inputMode="numeric"
                autoComplete="cc-csc"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px', padding: '12px', fontSize: '15px' }}
            disabled={gonderiliyor}
          >
            {gonderiliyor ? 'İşleniyor…' : `${odemeBilgisi.tutar.toFixed(2)} ₺ Öde`}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
          🔒 Bilgileriniz güvenli bir şekilde işlenir
        </div>
      </div>
    </div>
  );
}

export default Odeme;