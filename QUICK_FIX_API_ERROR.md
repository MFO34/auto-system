# 🔧 API Error Çözüm Rehberi

## Hata Nedenleri ve Çözümleri

### 1. Backend Çalışmıyor
**Belirti:** "Failed to load mechanics" veya "Network Error"

**Çözüm:**
```bash
cd backend
mvn spring-boot:run
```

**Kontrol:**
- Browser'da aç: `http://localhost:8080/swagger-ui.html`
- Eğer açılıyorsa backend çalışıyor ✅

---

### 2. Employee/Mechanic Yok
**Belirti:** Dropdown boş geliyor

**Çözüm 1 - Swagger'dan Ekle:**
1. `http://localhost:8080/swagger-ui.html` aç
2. `employee-controller` bul
3. `POST /employees` endpoint'ini aç
4. "Try it out" tıkla
5. Şu JSON'u yapıştır:
```json
{
  "empFirstName": "Ali",
  "empLastName": "Yılmaz",
  "empEmail": "ali@example.com",
  "empPhone": "1234567890",
  "empAddress": "İstanbul",
  "empSpecialization": "Car Wash Specialist"
}
```
6. "Execute" tıkla
7. Birkaç mechanic daha ekle

**Çözüm 2 - Database'den Ekle:**
```sql
INSERT INTO employee (emp_first_name, emp_last_name, emp_email, emp_phone, emp_address, emp_specialization)
VALUES
('Mehmet', 'Demir', 'mehmet@example.com', '5551234567', 'Ankara', 'Maintenance Expert'),
('Ayşe', 'Kaya', 'ayse@example.com', '5559876543', 'İzmir', 'Detail Specialist');
```

---

### 3. Service Yok
**Belirti:** Booking sayfasında servis listesi boş

**Çözüm - Swagger'dan Ekle:**
1. `http://localhost:8080/swagger-ui.html` aç
2. `service-controller` bul
3. `POST /addservice` endpoint'ini aç
4. Şu JSON'ları ekle:

```json
{
  "serviceName": "Exterior Wash",
  "serviceDesc": "Complete exterior wash with premium soap",
  "servicePrice": 500,
  "serviceType": "WASH",
  "durationMinutes": 30
}
```

```json
{
  "serviceName": "Interior Cleaning",
  "serviceDesc": "Full interior vacuum and cleaning",
  "servicePrice": 800,
  "serviceType": "WASH",
  "durationMinutes": 45
}
```

```json
{
  "serviceName": "Oil Change",
  "serviceDesc": "Engine oil and filter replacement",
  "servicePrice": 2000,
  "serviceType": "MAINTENANCE",
  "durationMinutes": 60
}
```

```json
{
  "serviceName": "Brake Check",
  "serviceDesc": "Complete brake system inspection",
  "servicePrice": 1500,
  "serviceType": "MAINTENANCE",
  "durationMinutes": 45
}
```

---

### 4. Phone Number Validation Hatası
**Belirti:** "Phone number should be 10 digits"

**Çözüm:** Telefon numarasını tam 10 rakam olarak gir
- ✅ Doğru: `1234567890`
- ❌ Yanlış: `123-456-7890`
- ❌ Yanlış: `+90 123 456 7890`

---

### 5. License Plate Validation Hatası
**Belirti:** "License Plate can't be empty"

**Çözüm:** License Plate alanı zorunlu, mutlaka doldur
- Örnek: `34ABC123` veya `TEST-123`

---

### 6. Mechanic Selection Hatası
**Belirti:** "Mechanic/Technician can't be empty"

**Çözüm:**
- Dropdown'dan bir mechanic seç
- Eğer dropdown boş ise, yukarıdaki "Employee/Mechanic Yok" çözümünü uygula

---

### 7. Date Format Hatası
**Belirti:** Backend'de date parsing hatası

**Çözüm:** Frontend zaten doğru format gönderiyor:
```javascript
appointmentDate: "2025-12-01"  // LocalDate format
appointmentTime: "14:30"       // LocalTime format
```

Eğer hata alıyorsan, browser console'da şu komutu çalıştır:
```javascript
console.log(new Date().toISOString().split('T')[0]); // Bugünün tarihi
```

---

### 8. CORS Hatası
**Belirti:** "Access-Control-Allow-Origin" hatası

**Çözüm:** Backend'de zaten `@CrossOrigin(origins = "*")` var
- Backend'i yeniden başlat
- Browser cache'i temizle (Ctrl+Shift+Delete)

---

### 9. 500 Internal Server Error
**Belirti:** Booking yaparken 500 hatası

**Debugging Adımları:**
1. Backend console/log'larını kontrol et
2. Hangi satırda hata veriyor bak
3. Eksik field var mı kontrol et

**Sık Görülen Sebepler:**
- Database connection yok
- Required field null
- Foreign key constraint violation

**Çözüm:**
```bash
# Backend log'unu kontrol et
cd backend
# Log dosyasına bak veya console'u oku
```

---

### 10. Frontend Build Hatası
**Belirti:** `npm start` çalışmıyor

**Çözüm:**
```bash
cd frontend-client
rm -rf node_modules package-lock.json
npm install
npm start
```

---

## 🧪 Test Request (Postman/Swagger)

Eğer frontend'ten çalışmıyorsa, direkt API'yi test et:

### Test Request:
```http
POST http://localhost:8080/appointment/book
Content-Type: application/json

{
  "customerName": "Test User",
  "customerEmail": "test@example.com",
  "phoneNumber": "1234567890",
  "vehicleDetails": {
    "licensePlate": "TEST-123",
    "brand": "Toyota",
    "model": "Camry",
    "year": 2020,
    "fuelType": "PETROL"
  },
  "services": [
    {
      "serviceId": 1,
      "quantity": 1
    }
  ],
  "appointmentDate": "2025-12-15",
  "appointmentTime": "14:30",
  "preferredEmployeeId": 1,
  "paymentMethod": "Cash"
}
```

### Başarılı Response:
```json
{
  "id": 1,
  "customerName": "Test User",
  "customerEmail": "test@example.com",
  "phoneNumber": "1234567890",
  "vehicle": {
    "id": 1,
    "licensePlate": "TEST-123",
    "brand": "Toyota"
  },
  "appointmentDate": "2025-12-15",
  "appointmentTime": "14:30:00",
  "totalPrice": 500.0,
  "status": "PENDING"
}
```

---

## 🔍 Browser Console Debugging

Frontend'te hata kontrolü için:

1. **F12** tuşuna bas
2. **Console** tab'ına git
3. **Network** tab'ına git
4. Booking yap
5. Kırmızı (failed) request'leri bul
6. Tıkla ve "Response" tab'ını oku

**Örnek Console Komutları:**
```javascript
// Services yüklü mü kontrol et
fetch('http://localhost:8080/getallservices')
  .then(r => r.json())
  .then(data => console.log('Services:', data));

// Employees yüklü mü kontrol et
fetch('http://localhost:8080/employees')
  .then(r => r.json())
  .then(data => console.log('Employees:', data));
```

---

## 📋 Hızlı Checklist

Booking yapmadan önce kontrol et:

- [ ] Backend çalışıyor (`localhost:8080`)
- [ ] Database çalışıyor (PostgreSQL)
- [ ] En az 1 employee var
- [ ] En az 1 service var
- [ ] Frontend çalışıyor (`localhost:3000`)
- [ ] Name dolduruldu (5+ karakter)
- [ ] Email dolduruldu (geçerli format)
- [ ] Phone dolduruldu (tam 10 rakam)
- [ ] License Plate dolduruldu
- [ ] En az 1 service seçildi
- [ ] Mechanic seçildi
- [ ] Payment method seçildi
- [ ] Date & Time seçildi

---

## 💡 En Sık Hatalar

### Hata: "Mechanic/Technician can't be empty"
**Sebep:** Dropdown'dan seçim yapılmadı
**Çözüm:** ✅ Frontend validation eklendi - artık bu kontrolü yapıyor

### Hata: "License Plate can't be empty"
**Sebep:** Required field boş
**Çözüm:** License Plate alanını doldur

### Hata: "Failed to load mechanics"
**Sebep:** Backend'de employee yok veya API çalışmıyor
**Çözüm:** Employee ekle (yukarıda anlatıldı)

### Hata: "Phone number should be 10 digits"
**Sebep:** Telefon formatı yanlış
**Çözüm:** Sadece rakam gir, tire vs kullanma

---

## 🎯 Başarılı Booking İçin Örnek Data

```
Name: Ahmet Yılmaz
Email: ahmet@example.com
Phone: 5551234567

License Plate: 34ABC123
Brand: Toyota
Model: Corolla
Year: 2020
Fuel Type: Petrol
Mileage: 50000
Color: White

Services: Exterior Wash + Interior Cleaning
Mechanic: Ali Yılmaz
Payment: Cash
Date: Yarın
Time: 14:00
```

Bu data ile mutlaka çalışması lazım!
