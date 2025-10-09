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

### Tabel Events
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
    nama_lokasi VARCHAR(255) NOT NULL,
    alamat_lokasi TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    place_id VARCHAR(255),
    alamat_lengkap TEXT,
    kota VARCHAR(100),
    provinsi VARCHAR(100),
    kode_pos VARCHAR(10),
    negara VARCHAR(100) DEFAULT 'Indonesia',
    zoom_level INT DEFAULT 15,
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
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
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

### Tabel Saved Locations
```sql
CREATE TABLE saved_locations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama VARCHAR(255) NOT NULL,
    alamat TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    place_id VARCHAR(255),
    alamat_lengkap TEXT,
    kota VARCHAR(100),
    provinsi VARCHAR(100),
    kode_pos VARCHAR(10),
    negara VARCHAR(100) DEFAULT 'Indonesia',
    zoom_level INT DEFAULT 15,
    organization_id INT NOT NULL,
    jumlah_pemakaian INT DEFAULT 0,
    terakhir_digunakan TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);
```

## 3. Indexes untuk Performa

```sql
-- Index untuk pencarian events
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_dates ON events(tanggal_mulai, tanggal_selesai);
CREATE INDEX idx_events_location ON events(kota, provinsi);
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
CREATE INDEX idx_organizations_location ON organizations(kota, provinsi);
```

## 4. Sample Data Insert

### Categories
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
INSERT INTO organizations (nama, deskripsi, email, telepon, alamat, kota, provinsi, status_verifikasi, user_id) VALUES
('Yayasan Pendidikan Nusantara', 'Yayasan yang bergerak di bidang pendidikan untuk anak-anak kurang mampu', 'info@ypn.org', '081234567891', 'Jl. Pendidikan No. 123', 'Jakarta', 'DKI Jakarta', 'verified', 2),
('Komunitas Lingkungan Hijau', 'Komunitas yang fokus pada pelestarian lingkungan', 'info@lingkunganhijau.org', '081234567894', 'Jl. Hijau No. 456', 'Bandung', 'Jawa Barat', 'verified', 2);
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