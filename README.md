# 💊 Ecza Depoları İçin Kargo ve İlaç Stok Takip Sistemi

Modern ecza depolarının ilaç stoklarını ve kargo süreçlerini dijital ortamda yönetebilmesi amacıyla geliştirilmiş full-stack web uygulamasıdır.

## 🌐 Canlı Demo

**Vercel:** https://ecza-depolari-icin-kargo-ve-ilac-st.vercel.app/

---

# 📌 Proje Amacı

Bu proje;

* İlaç stoklarının düzenli olarak takip edilmesini,
* Kargo süreçlerinin yönetilmesini,
* Ecza depolarının operasyonel iş yükünün azaltılmasını,
* Kullanıcı dostu bir yönetim paneli sunulmasını

amaçlamaktadır.

---

# 🚀 Özellikler

### 👤 Kullanıcı İşlemleri

* Kullanıcı kayıt olma
* Güvenli giriş (JWT Authentication)
* Yetkilendirme sistemi
* Şifrelerin BCrypt ile şifrelenmesi

### 💊 İlaç Yönetimi

* Yeni ilaç ekleme
* İlaç bilgilerini güncelleme
* İlaç silme
* İlaç listeleme
* Stok miktarlarını takip etme

### 📦 Kargo Yönetimi

* Yeni sipariş oluşturma
* Kargo durumlarını görüntüleme
* Sipariş geçmişini inceleme
* Kargo süreçlerini takip etme

### 🏥 Eczane Yönetimi

* Eczane kayıtları
* Eczane bilgilerini düzenleme
* Eczane listeleme

### 🔒 Güvenlik

* JWT Authentication
* Şifre Hashleme (BCrypt)
* Rate Limiter ile brute-force saldırılarına karşı koruma
* Helmet ile HTTP güvenliği
* CORS desteği

---

# 🛠 Kullanılan Teknolojiler

## Frontend

* React
* React Router
* Axios
* Bootstrap
* CSS

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* BCrypt
* Helmet
* Express Rate Limit

## Deployment

* Frontend → Vercel
* Backend → Render
* Database → MongoDB Atlas

---
