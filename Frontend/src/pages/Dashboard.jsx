import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const DURUM_RENK = {
  'Hazırlanıyor': '#9C93B5',
  'Kargoya Verildi': '#3B82F6',
  'Yolda': '#E2953D',
  'Dağıtımda': '#8B5CF6',
  'Teslim Edildi': '#227A55',
  'İptal': '#D14D4D'
};

const AKIS_ADIMLARI = [
  { key: 'eczane', baslik: 'Eczane', aciklama: 'Kayıtlı müşteri', sayfa: '/eczaneler' },
  { key: 'siparis', baslik: 'Sipariş', aciklama: 'Beklemede', sayfa: '/siparisler' },
  { key: 'stok', baslik: 'Depo', aciklama: 'Onaylanır, stok düşer', sayfa: '/ilaclar' },
  { key: 'kargo', baslik: 'Sevkiyat', aciklama: 'Takip edilir', sayfa: '/kargolar' }
];

function Dashboard() {
  const [ozet, setOzet] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [eczaneSayisi, setEczaneSayisi] = useState(0);
  const [kritikStokSayisi, setKritikStokSayisi] = useState(0);
  const [bekleyenSiparisSayisi, setBekleyenSiparisSayisi] = useState(0);
  const [siparislerim, setSiparislerim] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const personelMi = role === 'personel';

  useEffect(() => {
    if (personelMi) {
      api.get('/kargo/istatistik/ozet')
        .then((res) => setOzet(res.data))
        .catch((err) => console.error('İstatistik getirilemedi:', err))
        .finally(() => setYukleniyor(false));

      api.get('/ilac')
        .then((res) => {
          const kritik = res.data.filter((i) => i.stokMiktari <= i.kritikStokSeviyesi).length;
          setKritikStokSayisi(kritik);
        })
        .catch((err) => console.error('İlaçlar getirilemedi:', err));

      api.get('/eczane')
        .then((res) => setEczaneSayisi(res.data.length))
        .catch((err) => console.error('Eczaneler getirilemedi:', err));
    } else {
      setYukleniyor(false);
    }

    api.get('/siparis')
      .then((res) => {
        const bekleyen = res.data.filter((s) => s.durum === 'Beklemede').length;
        setBekleyenSiparisSayisi(bekleyen);
        setSiparislerim(res.data);
      })
      .catch((err) => console.error('Siparişler getirilemedi:', err));
  }, [personelMi]);

  const akisSayilari = {
    eczane: eczaneSayisi,
    siparis: bekleyenSiparisSayisi,
    stok: kritikStokSayisi,
    kargo: ozet?.toplam ?? 0
  };

  if (yukleniyor) {
    return <div className="page"><div className="empty-state">Yükleniyor...</div></div>;
  }

  // ECZANE ROLÜ: sadece sipariş odaklı sade bir görünüm
  if (!personelMi) {
    const aktifSevkiyatlar = siparislerim
      .filter((s) => s.kargo)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    return (
      <div className="page">
        <div className="page-header">
          <h2>Dashboard</h2>
        </div>

        <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
          <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            BEKLEYEN SİPARİŞİM
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '40px', color: 'var(--color-primary-dark)', marginTop: '4px' }}>
            {bekleyenSiparisSayisi}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <button className="btn btn-primary" onClick={() => navigate('/siparis-olustur')}>
            + Yeni Sipariş
          </button>
          <button className="btn btn-ghost" onClick={() => navigate('/siparisler')}>
            Siparişlerim
          </button>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '15px', marginBottom: '18px' }}>Aktif Sevkiyatlarım</h3>
          {aktifSevkiyatlar.length === 0 ? (
            <div className="empty-state">Henüz sevkiyata çıkan bir siparişin yok.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {aktifSevkiyatlar.map((s) => (
                <div
                  key={s._id}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                  onClick={() => navigate('/siparisler')}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600 }}>{s.kargo.takipNo}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      {new Date(s.createdAt).toLocaleDateString('tr-TR')} · {s.urunler.length} ürün
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '999px',
                      color: '#fff',
                      background: DURUM_RENK[s.kargo.durum] || '#888'
                    }}
                  >
                    {s.kargo.durum}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // PERSONEL ROLÜ: tam süreç akışı
  if (!ozet) {
    return <div className="page"><div className="empty-state">İstatistikler yüklenemedi.</div></div>;
  }

  const maxDeger = Math.max(...Object.values(ozet.durumDagilimi), 1);

  return (
    <div className="page">
      <div className="page-header">
        <h2>Dashboard</h2>
      </div>

      <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
        <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '18px' }}>
          SÜREÇ AKIŞI
        </div>
        <div className="akis-satiri">
          {AKIS_ADIMLARI.map((adim, i) => (
            <div key={adim.key} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div className="akis-adim" onClick={() => navigate(adim.sayfa)}>
                <div className="akis-adim-sayi">{akisSayilari[adim.key]}</div>
                <div className="akis-adim-baslik">{adim.baslik}</div>
                <div className="akis-adim-aciklama">{adim.aciklama}</div>
              </div>
              {i < AKIS_ADIMLARI.length - 1 && <div className="akis-ok">→</div>}
            </div>
          ))}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '10px',
        marginBottom: '24px'
      }}>
        <button className="btn btn-primary" onClick={() => navigate('/siparis-olustur')}>
          + Yeni Sipariş
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/ilac-ekle')}>
          + Stok Ekle
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/eczane-ekle')}>
          + Eczane Ekle
        </button>
        <button className="btn btn-ghost" onClick={() => navigate('/')}>
          Kargo Sorgula
        </button>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '15px', marginBottom: '18px' }}>Sevkiyat durum dağılımı</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.entries(ozet.durumDagilimi).map(([durum, sayi]) => (
            <div key={durum} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '130px', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                {durum}
              </div>
              <div style={{ flex: 1, background: 'var(--color-bg)', borderRadius: '6px', height: '18px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${(sayi / maxDeger) * 100}%`,
                    background: DURUM_RENK[durum],
                    height: '100%',
                    borderRadius: '6px',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>
              <div style={{ width: '24px', fontSize: '13px', fontWeight: 600, textAlign: 'right' }}>
                {sayi}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
