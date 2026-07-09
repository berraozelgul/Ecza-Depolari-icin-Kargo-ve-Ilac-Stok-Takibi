/*import {BrowserRouter,Routes,Route} from 'react-router-dom';
//browserRouter tüm uygulamayı saran sayfa geçişi özelliğini aktif eden ana kutu
//Routes hangi adreste hangi sayfanın gönderileceğini tanımlayan liste 
//route listedeki her bir adres sayfa eşleşmesi
import Login from './pages/Login';
import KargoListesi from './pages/KargoListesi';
import KargoEkle from './pages/KargoEkle';
//az önce oluşturulan 3 sayfa componenti kullanmak için buraya çağırma
function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/kargolar" element={<KargoListesi />} />
        <Route path="/kargo-ekle" element={<KargoEkle />} />
      </Routes>
    </BrowserRouter>
  );
}
//normalde tek bir sayfa gibi görünen react uygulamasına çoklu sayfa(multipage) davranışı kazandırmak Single Page Application routing denir aslında sayfa yenilenmez sadece ekranda gösterilen bileşen değişir.c
export default App;*/
import IlacDuzenle from './pages/IlacDuzenle';
import EczaneDuzenle from './pages/EczaneDuzenle';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import KargoSorgula from './pages/KargoSorgula';
import Login from './pages/Login';
import Register from './pages/Register';
import KargoListesi from './pages/KargoListesi';
import KargoEkle from './pages/KargoEkle';
import Dashboard from './pages/Dashboard';
import IlacListesi from './pages/IlacListesi';
import IlacEkle from './pages/IlacEkle';
import EczaneListesi from './pages/EczaneListesi';
import EczaneEkle from './pages/EczaneEkle';
import SiparisListesi from './pages/SiparisListesi';
import SiparisOlustur from './pages/SiparisOlustur';
import GerekliGiris from './components/GerekliGiris';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<KargoSorgula />} />
        <Route path="/giris" element={<Login />} />
        <Route path="/kayit" element={<Register />} />
        <Route path="/dashboard" element={<GerekliGiris><Dashboard /></GerekliGiris>} />
        <Route path="/kargolar" element={<GerekliGiris><KargoListesi /></GerekliGiris>} />
        <Route path="/kargo-ekle" element={<GerekliGiris><KargoEkle /></GerekliGiris>} />
        <Route path="/ilaclar" element={<GerekliGiris><IlacListesi /></GerekliGiris>} />
        <Route path="/ilac-ekle" element={<GerekliGiris><IlacEkle /></GerekliGiris>} />
        <Route path="/eczaneler" element={<GerekliGiris><EczaneListesi /></GerekliGiris>} />
        <Route path="/eczane-ekle" element={<GerekliGiris><EczaneEkle /></GerekliGiris>} />
        <Route path="/siparisler" element={<GerekliGiris><SiparisListesi /></GerekliGiris>} />
        <Route path="/siparis-olustur" element={<GerekliGiris><SiparisOlustur /></GerekliGiris>} />
        <Route path="/ilac-duzenle/:id" element={<GerekliGiris><IlacDuzenle /></GerekliGiris>} />
<Route path="/eczane-duzenle/:id" element={<GerekliGiris><EczaneDuzenle /></GerekliGiris>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
