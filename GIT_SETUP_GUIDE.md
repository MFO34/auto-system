# 🔗 Git Repository Kurulum Rehberi

## Kendi Repository'ni Oluşturma ve Push Etme

### Adım 1: GitHub'da Yeni Repository Oluştur

1. **GitHub'a git:** https://github.com
2. **Sağ üstteki '+' butonuna tıkla** → "New repository"
3. **Repository bilgilerini doldur:**
   - Repository name: `auto-carwash-management-system`
   - Description: "Auto Car Wash & Maintenance Appointment System - Built with Spring Boot & React"
   - Visibility: Public veya Private (tercihin)
   - ❌ **Initialize with README** - BUNU SEÇ ME! (projen zaten README var)
   - ❌ **Add .gitignore** - SEÇ ME!
   - ❌ **Choose a license** - SEÇ ME!
4. **"Create repository"** butonuna tıkla

### Adım 2: Mevcut Git Geçmişini Temizle

Eski repository bağlantısını kaldır:

```bash
cd c:\Projects\Auto-Industry-System

# Mevcut git klasörünü sil (Windows)
rmdir /s /q .git

# Veya PowerShell'de:
Remove-Item -Recurse -Force .git
```

### Adım 3: Yeni Git Repository Başlat

```bash
# Git repository başlat
git init

# Default branch'i main yap
git branch -M main
```

### Adım 4: .gitignore Dosyası Oluştur

`.gitignore` dosyası oluştur (proje root directory'de):

```bash
# Backend ignores
backend/target/
backend/.mvn/
backend/mvnw
backend/mvnw.cmd
backend/.idea/
backend/*.iml
backend/.settings/
backend/.classpath
backend/.project

# Frontend ignores
frontend-client/node_modules/
frontend-client/build/
frontend-client/.env
frontend-client/.env.local
frontend-client/.env.development.local
frontend-client/.env.test.local
frontend-client/.env.production.local
frontend-client/npm-debug.log*
frontend-client/yarn-debug.log*
frontend-client/yarn-error.log*

# Frontend Admin ignores
frontend-admin/node_modules/
frontend-admin/build/
frontend-admin/.env
frontend-admin/.env.local

# OS ignores
.DS_Store
Thumbs.db
*.log
*.swp
*.swo

# IDE ignores
.vscode/
.idea/
*.iml
```

### Adım 5: Dosyaları Stage'e Ekle

```bash
# Tüm dosyaları ekle
git add .

# Kontrol et (opsiyonel)
git status
```

### Adım 6: İlk Commit'i Oluştur

```bash
git commit -m "Initial commit: Auto Car Wash & Maintenance System

- Spring Boot backend with Java 21 & PostgreSQL
- React frontend client with modern UI
- React admin panel
- Vehicle management system
- Multi-service appointment booking
- Real-time price calculation
- Payment method tracking
- Service type filtering (WASH/MAINTENANCE)
- Complete car wash industry branding"
```

### Adım 7: Remote Repository Bağla

GitHub'da oluşturduğun repository'nin URL'ini kullan:

```bash
# HTTPS kullanarak (önerilen)
git remote add origin https://github.com/KULLANICI_ADIN/auto-carwash-management-system.git

# SSH kullanarak (SSH key varsa)
# git remote add origin git@github.com:KULLANICI_ADIN/auto-carwash-management-system.git
```

**Not:** `KULLANICI_ADIN` yerine kendi GitHub kullanıcı adını yaz!

### Adım 8: Push Et!

```bash
# İlk push (-u ile main branch'i upstream olarak ayarla)
git push -u origin main
```

### Adım 9: GitHub Personal Access Token (Gerekirse)

Eğer push yaparken "Support for password authentication was removed" hatası alırsan:

1. **GitHub → Settings → Developer settings**
2. **Personal access tokens → Tokens (classic)**
3. **Generate new token (classic)**
4. **Scopes:** `repo` seçeneğini işaretle
5. **Generate token** → Token'ı kopyala
6. **Git push yaparken:**
   - Username: GitHub kullanıcı adın
   - Password: Oluşturduğun token'ı yapıştır

---

## 🔄 Güncellemeleri Push Etme (Sonraki Değişiklikler)

```bash
# Değişiklikleri kontrol et
git status

# Değiştirilen dosyaları ekle
git add .

# Veya belirli dosyaları ekle
git add backend/src/main/java/com/jamsy/shop/controller/AppointmentController.java

# Commit oluştur
git commit -m "Add: New feature description"

# Push et
git push
```

### Commit Message Formatı (Best Practice)

```bash
# Yeni özellik
git commit -m "Add: Vehicle registration feature"

# Düzeltme
git commit -m "Fix: Mechanic dropdown loading issue"

# Güncelleme
git commit -m "Update: Navbar branding to Auto Car Wash"

# Silme
git commit -m "Remove: Deprecated salon references"

# Refactoring
git commit -m "Refactor: Booking service for better performance"
```

---

## 🌳 Branch Kullanımı (Önerilen)

### Development Branch Oluştur

```bash
# Development branch oluştur
git checkout -b development

# Development'a push et
git push -u origin development
```

### Feature Branch'leri

```bash
# Yeni özellik için branch oluştur
git checkout -b feature/maintenance-wizard

# Değişiklikleri yap
git add .
git commit -m "Add: Maintenance wizard UI component"

# Feature branch'i push et
git push -u origin feature/maintenance-wizard
```

### Branch'leri Merge Et

```bash
# Main branch'e geç
git checkout main

# Feature branch'i merge et
git merge feature/maintenance-wizard

# Push et
git push
```

---

## 📝 README.md Güncelle

Repository'nin ana sayfası için README.md'yi güncelle:

```markdown
# 🚗 Auto Car Wash & Maintenance System

Complete appointment management system for car wash and maintenance services.

## 🎯 Features

- 🚙 Vehicle Management
- 📅 Multi-Service Appointment Booking
- 💰 Real-time Price Calculation
- 👨‍🔧 Employee/Mechanic Assignment
- 🔍 Service Filtering (WASH/MAINTENANCE)
- 💳 Payment Method Tracking
- 📊 Admin Dashboard
- 🎨 Modern, Responsive UI

## 🛠️ Tech Stack

### Backend
- Java 21
- Spring Boot 3.2.2
- PostgreSQL 14+
- Maven
- JWT Authentication

### Frontend
- React 18
- Material-UI
- Axios
- Redux

## 🚀 Quick Start

### Prerequisites
- Java 21 JDK
- Node.js 16+
- PostgreSQL 14+
- Maven

### Backend Setup
\`\`\`bash
cd backend
mvn clean install
mvn spring-boot:run
\`\`\`

### Frontend Setup
\`\`\`bash
cd frontend-client
npm install
npm start
\`\`\`

## 📖 Documentation

- [Setup Guide](FINAL_FIXES_AND_SETUP.md)
- [Frontend Updates](FRONTEND_UPDATES.md)
- [API Documentation](http://localhost:8080/swagger-ui.html)

## 👤 Author

[Your Name]

## 📄 License

This project is licensed under the MIT License.
```

---

## 🎯 Git Workflow Önerileri

### 1. Daily Workflow

```bash
# Günü başlat
git pull origin main

# Çalış, değişiklik yap...

# Commit et
git add .
git commit -m "Update: Description of changes"

# Push et
git push
```

### 2. Collaborative Workflow

```bash
# Main'den yeni branch oluştur
git checkout main
git pull
git checkout -b feature/your-feature-name

# Değişiklikleri yap ve commit et
git add .
git commit -m "Add: Your feature"

# Push et
git push -u origin feature/your-feature-name

# GitHub'da Pull Request oluştur
```

### 3. Emergency Hotfix

```bash
# Hotfix branch oluştur
git checkout main
git checkout -b hotfix/critical-bug

# Düzelt
git add .
git commit -m "Fix: Critical bug description"

# Push ve merge
git push -u origin hotfix/critical-bug
git checkout main
git merge hotfix/critical-bug
git push
```

---

## 🔍 Faydalı Git Komutları

```bash
# Commit geçmişini gör
git log --oneline --graph --all

# Değişiklikleri gör
git diff

# Son commit'i değiştir
git commit --amend -m "Updated commit message"

# Dosyayı staging'den çıkar
git restore --staged filename.java

# Local değişiklikleri geri al
git restore filename.java

# Branch listesi
git branch -a

# Remote branch'i local'e al
git checkout -b feature-name origin/feature-name

# Eski commit'e dön (dikkatli!)
git reset --hard COMMIT_HASH
```

---

## 🎓 Git Best Practices

### ✅ DO
- Her mantıklı değişiklik için ayrı commit
- Anlamlı commit mesajları yaz
- Sık sık commit ve push yap
- .gitignore kullan (sensitive data'yı push etme!)
- Branch kullan (main'e direkt commit yapma)

### ❌ DON'T
- Çok büyük commit'ler yapma
- "fix" veya "update" gibi belirsiz mesajlar
- node_modules/ veya target/ gibi klasörleri push etme
- Şifre, API key gibi bilgileri push etme
- Force push kullanma (özellikle shared branch'lerde)

---

## 🔐 Sensitive Data Yönetimi

### application.properties için

1. **Template oluştur:**
```properties
# application.properties.template
spring.datasource.url=jdbc:postgresql://localhost:5432/DB_NAME
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

2. **.gitignore'a ekle:**
```
application.properties
```

3. **README'de not düş:**
```markdown
## Configuration
Copy `application.properties.template` to `application.properties` and fill in your credentials.
```

---

## 🎉 Repository Hazır!

Artık kendi Git repository'n var!

**Sonraki Adımlar:**
1. ✅ Code'unu düzenli olarak commit et
2. ✅ Branch'ler kullan
3. ✅ README'yi güncel tut
4. ✅ Issues ve Projects kullan (GitHub'da)
5. ✅ Wiki oluştur (optional)

**Repo URL'in:** `https://github.com/KULLANICI_ADIN/auto-carwash-management-system`
