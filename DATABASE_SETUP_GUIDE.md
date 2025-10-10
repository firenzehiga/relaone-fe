# Database Setup Guide - MySQL Workbench

## 1. Persiapan Database

### Membuat Database Baru
```sql
CREATE DATABASE volunteer_management;
USE volunteer_management;
```

## 2. Struktur Tabel Database

### Tabel Users
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telepon VARCHAR(20),
    tanggal_lahir DATE,
    jenis_kelamin ENUM('laki-laki', 'perempuan', 'lainnya'),
    alamat TEXT,
    foto_profil VARCHAR(500),
    role ENUM('volunteer', 'admin', 'organization') DEFAULT 'volunteer',
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    email_verified_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabel Organizations
```sql
CREATE TABLE organizations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    email VARCHAR(255) UNIQUE NOT NULL,
    telepon VARCHAR(20),
    website VARCHAR(500),
    logo VARCHAR(500),
    alamat TEXT,
    kota VARCHAR(100),
    provinsi VARCHAR(100),
    kode_pos VARCHAR(10),
    negara VARCHAR(100) DEFAULT 'Indonesia',
    status_verifikasi ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_events INT DEFAULT 0,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Tabel Categories
```sql
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama VARCHAR(100) NOT NULL UNIQUE,
    deskripsi TEXT,
    icon VARCHAR(100),
    warna VARCHAR(7) DEFAULT '#3B82F6',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabel Events (Updated untuk Normalisasi)
```sql
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT NOT NULL,
    deskripsi_singkat TEXT,
    gambar VARCHAR(500),
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE NOT NULL,
    waktu_mulai TIME NOT NULL,
    waktu_selesai TIME NOT NULL,
    maks_peserta INT NOT NULL,
    peserta_saat_ini INT DEFAULT 0,
    location_id INT NOT NULL, -- FK ke locations table
    status ENUM('draft', 'published', 'ongoing', 'completed', 'cancelled') DEFAULT 'draft',
    persyaratan TEXT,
    manfaat TEXT,
    nama_kontak VARCHAR(255),
    telepon_kontak VARCHAR(20),
    email_kontak VARCHAR(255),
    batas_pendaftaran DATE,
    category_id INT NOT NULL,
    organization_id INT NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE RESTRICT,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);
```

### Tabel Organizations (Updated untuk Normalisasi)
```sql
CREATE TABLE organizations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    email VARCHAR(255) UNIQUE NOT NULL,
    telepon VARCHAR(20),
    website VARCHAR(500),
    logo VARCHAR(500),
    location_id INT, -- FK ke locations table (nullable)
    status_verifikasi ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_events INT DEFAULT 0,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Tabel Event Participants
```sql
CREATE TABLE event_participants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    status ENUM('registered', 'confirmed', 'attended', 'cancelled', 'no_show') DEFAULT 'registered',
    tanggal_daftar TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tanggal_konfirmasi TIMESTAMP NULL,
    tanggal_hadir TIMESTAMP NULL,
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_participant (event_id, user_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Tabel Feedbacks
```sql
CREATE TABLE feedbacks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    komentar TEXT,
    is_anonim BOOLEAN DEFAULT FALSE,
    is_disetujui BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_feedback (event_id, user_id),
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Tabel Locations (Centralized)
```sql
CREATE TABLE locations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama VARCHAR(255) NOT NULL,
    alamat TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    place_id VARCHAR(255),
    alamat_lengkap TEXT,
    kota VARCHAR(100),
    provinsi VARCHAR(100),
    kode_pos VARCHAR(10),
    negara VARCHAR(100) DEFAULT 'Indonesia',
    zoom_level INT DEFAULT 15,
    tipe ENUM('event', 'organization', 'saved') DEFAULT 'event',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_location_place_id (place_id),
    INDEX idx_location_coordinates (latitude, longitude),
    INDEX idx_location_area (kota, provinsi)
);
```

### Tabel Saved Locations (Simplified)
```sql
CREATE TABLE saved_locations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    location_id INT NOT NULL,
    organization_id INT NOT NULL,
    nama_custom VARCHAR(255), -- nama khusus untuk organisasi
    jumlah_pemakaian INT DEFAULT 0,
    terakhir_digunakan TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_org_location (organization_id, location_id),
    FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);
```

## 3. Indexes untuk Performa

```sql
-- Index untuk pencarian events
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_dates ON events(tanggal_mulai, tanggal_selesai);
CREATE INDEX idx_events_location ON events(location_id);
CREATE INDEX idx_events_category ON events(category_id);
CREATE INDEX idx_events_organization ON events(organization_id);

-- Index untuk participants
CREATE INDEX idx_participants_status ON event_participants(status);
CREATE INDEX idx_participants_date ON event_participants(tanggal_daftar);

-- Index untuk feedbacks
CREATE INDEX idx_feedbacks_rating ON feedbacks(rating);
CREATE INDEX idx_feedbacks_approved ON feedbacks(is_disetujui);

-- Index untuk users
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- Index untuk organizations
CREATE INDEX idx_organizations_verification ON organizations(status_verifikasi);
CREATE INDEX idx_organizations_location ON organizations(location_id);

-- Index untuk locations
CREATE INDEX idx_locations_area ON locations(kota, provinsi);
CREATE INDEX idx_locations_coordinates ON locations(latitude, longitude);
CREATE INDEX idx_locations_place_id ON locations(place_id);
```

## 📊 **Analisis Normalisasi Database**

### ❌ **Masalah Sebelum Normalisasi:**
1. **Data Lokasi Redundan** - kota, provinsi tersebar di 3 tabel
2. **Place ID Tidak Terstruktur** - disimpan sebagai string di multiple tabel
3. **Duplikasi Data Alamat** - sama alamat disimpan berkali-kali

### ✅ **Solusi Normalisasi (Yang Sudah Diterapkan):**
1. **Tabel `locations`** - centralized untuk semua data lokasi
2. **Foreign Key `location_id`** - di events dan organizations  
3. **Saved Locations** - jadi relasi many-to-many antara organizations & locations
4. **Indexes Optimized** - untuk performa query lokasi

### 🎯 **Keuntungan Struktur Baru:**
- ✅ **No Redundancy** - satu lokasi disimpan sekali
- ✅ **Reusable Locations** - org bisa pakai lokasi yang sama untuk multiple events
- ✅ **Easy Google Maps Integration** - place_id tersentralisasi
- ✅ **Better Performance** - indexes pada koordinat dan area
- ✅ **Flexible Saved Locations** - org bisa save lokasi dengan nama custom

### 🔄 **Urutan Eksekusi Yang Benar:**
1. Buat tabel `users` dulu
2. Buat tabel `categories` dan `locations`
3. Buat tabel `organizations` (dengan FK ke locations)
4. Buat tabel `events` (dengan FK ke locations, categories, organizations)
5. Buat tabel `saved_locations` (dengan FK ke locations & organizations)
6. Buat tabel `event_participants` dan `feedbacks`
7. Insert sample data sesuai urutan dependencies

## 4. Sample Data Insert
```sql
INSERT INTO categories (nama, deskripsi, icon, warna) VALUES
('Pendidikan', 'Kegiatan volunteer di bidang pendidikan', 'graduation-cap', '#3B82F6'),
('Kesehatan', 'Kegiatan volunteer di bidang kesehatan', 'heart', '#EF4444'),
('Lingkungan', 'Kegiatan volunteer untuk lingkungan', 'leaf', '#10B981'),
('Sosial', 'Kegiatan volunteer sosial kemasyarakatan', 'users', '#F59E0B'),
('Teknologi', 'Kegiatan volunteer di bidang teknologi', 'laptop', '#8B5CF6'),
('Kemanusiaan', 'Kegiatan volunteer kemanusiaan', 'hand-heart', '#EC4899');
```

### Sample Users
```sql
INSERT INTO users (nama, email, password, telepon, role, status) VALUES
('Admin System', 'admin@volunteer.com', '$2y$10$hash', '081234567890', 'admin', 'active'),
('Yayasan Pendidikan Nusantara', 'info@ypn.org', '$2y$10$hash', '081234567891', 'organization', 'active'),
('John Volunteer', 'john@example.com', '$2y$10$hash', '081234567892', 'volunteer', 'active'),
('Jane Volunteer', 'jane@example.com', '$2y$10$hash', '081234567893', 'volunteer', 'active');
```

### Sample Organizations
```sql
-- Insert sample locations dulu
INSERT INTO locations (nama, alamat, kota, provinsi, negara, latitude, longitude) VALUES
('Kantor YPN Jakarta', 'Jl. Pendidikan No. 123', 'Jakarta', 'DKI Jakarta', 'Indonesia', -6.2088, 106.8456),
('Kantor KLH Bandung', 'Jl. Hijau No. 456', 'Bandung', 'Jawa Barat', 'Indonesia', -6.9175, 107.6191);

-- Insert organizations dengan location_id
INSERT INTO organizations (nama, deskripsi, email, telepon, location_id, status_verifikasi, user_id) VALUES
('Yayasan Pendidikan Nusantara', 'Yayasan yang bergerak di bidang pendidikan untuk anak-anak kurang mampu', 'info@ypn.org', '081234567891', 1, 'verified', 2),
('Komunitas Lingkungan Hijau', 'Komunitas yang fokus pada pelestarian lingkungan', 'info@lingkunganhijau.org', '081234567894', 2, 'verified', 2);
```

### Sample Events dengan Locations
```sql
-- Insert event locations
INSERT INTO locations (nama, alamat, kota, provinsi, negara, latitude, longitude, tipe) VALUES
('SDN 01 Jakarta Pusat', 'Jl. Merdeka No. 10, Jakarta Pusat', 'Jakarta', 'DKI Jakarta', 'Indonesia', -6.1751, 106.8650, 'event'),
('Taman Kota Bandung', 'Jl. Taman No. 5, Bandung', 'Bandung', 'Jawa Barat', 'Indonesia', -6.9147, 107.6098, 'event');

-- Insert sample events
INSERT INTO events (judul, deskripsi, deskripsi_singkat, tanggal_mulai, tanggal_selesai, waktu_mulai, waktu_selesai, maks_peserta, location_id, category_id, organization_id, created_by) VALUES
('Mengajar Anak Sekolah Dasar', 'Program volunteer mengajar di sekolah dasar untuk membantu anak-anak belajar', 'Mengajar di SD', '2024-11-15', '2024-11-15', '08:00:00', '12:00:00', 20, 3, 1, 1, 2),
('Bersih-Bersih Taman Kota', 'Kegiatan gotong royong membersihkan taman kota dari sampah', 'Bersih-bersih taman', '2024-11-20', '2024-11-20', '07:00:00', '11:00:00', 50, 4, 3, 2, 2);
```

## 5. Langkah-langkah Eksekusi di MySQL Workbench

### Step 1: Buka MySQL Workbench
1. Pastikan XAMPP MySQL sudah running
2. Buka MySQL Workbench
3. Connect ke local MySQL server (biasanya root tanpa password)

### Step 2: Buat Database
1. Klik kanan di Navigator → Create Schema
2. Nama: `volunteer_management`
3. Atau jalankan query: `CREATE DATABASE volunteer_management;`

### Step 3: Jalankan Script Tabel
1. Buka SQL Editor baru
2. Copy-paste script CREATE TABLE satu per satu
3. Jalankan setiap script dengan Ctrl+Enter
4. Pastikan tidak ada error

### Step 4: Tambah Indexes
1. Jalankan script CREATE INDEX
2. Verifikasi indexes dibuat dengan benar

### Step 5: Insert Sample Data
1. Jalankan script INSERT categories
2. Jalankan script INSERT users (ganti password hash dengan yang benar)
3. Jalankan script INSERT organizations

### Step 6: Verifikasi
1. Cek semua tabel sudah dibuat: `SHOW TABLES;`
2. Cek struktur tabel: `DESCRIBE table_name;`
3. Cek data sample: `SELECT * FROM categories;`

## 6. Konfigurasi Koneksi

### File .env (untuk Laravel nanti)
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=volunteer_management
DB_USERNAME=root
DB_PASSWORD=
```

## 7. Tips Troubleshooting

### Jika Ada Error Foreign Key
- Pastikan tabel parent sudah dibuat dulu
- Pastikan tipe data column yang di-reference sama persis
- Periksa nama tabel dan column sudah benar

### Jika Insert Sample Data Error
- Pastikan tabel categories sudah ada sebelum insert ke events
- Pastikan users sudah ada sebelum insert ke organizations
- Ganti password hash dengan yang valid

### Performance Tips
- Jangan lupa buat indexes setelah insert data besar
- Monitor query performance dengan EXPLAIN
- Backup database secara berkala

## 8. Maintenance Scripts

### Backup Database
```sql
-- Via mysqldump command
mysqldump -u root -p volunteer_management > backup.sql
```

### Reset Auto Increment
```sql
ALTER TABLE table_name AUTO_INCREMENT = 1;
```

### Cleanup Test Data
```sql
-- Hati-hati, ini akan menghapus semua data
TRUNCATE TABLE event_participants;
TRUNCATE TABLE feedbacks;
TRUNCATE TABLE events;
TRUNCATE TABLE saved_locations;
```

Database siap digunakan untuk development! 🚀