import axios from 'axios';

const api=axios.create({
    baseURL: 'http://localhost:5000/api'
});
//her istekte token ekleme 
api.interceptors.request.use((config)=>{//her istek gönderilmeden hemen önce çalışaxak bir fonksiyon api.post() gibi her çağrıdan önce bu kod araya giriyor interceptor=araya giren
    const token=localStorage.getItem('token');//tarayıcının kalıcı depolama alanından (localStorage) daha önce kaydettiğimiz JWT tokenı okuyor.
    if(token){
        config.headers.Authorization=`Bearer ${token}`;
        //token varsa gönderilecek isteğin headerına (authorization başlığına ) otomatik olarak ekliyor.
    }
    return config;//değişiklik yapılmış isteği geri döndürüyor böylece istek normal şekilde gönderiliyor.
});
export default api;
//amaç:login sayfası dışındaki tüm sayfalarda tokenı manuel eklemekle uğraşmamak bir kere login olduktan sonra tüm istekler otomatik olarak tokenlı gidiyor.c