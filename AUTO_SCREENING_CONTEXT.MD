# Konteks Lengkap: Auto-Screening Pendaftaran Volunteer

## 1) Ringkasan Perubahan
Saat volunteer join event, backend sekarang menghitung auto-screening dan menyimpan hasilnya ke `event_participants`. Status peserta tetap `registered`, bukan otomatis `confirmed`.

## 2) Field Baru di `event_participants`
- `auto_approve_eligible` (boolean)
- `review_reasons` (array string | null)
- `auto_approve_checked_at` (timestamp | null)

Schema ada di `database/migrations/2026_05_31_000001_add_auto_approve_fields_to_event_participants_table.php`.

## 3) Logic Screening (Join Event)
Dihitung saat join event di `app/Http/Controllers/Volunteer/VolunteerController.php`.

Rule yang dipakai:
1. Email verified
   - `email_verified_at` harus ada
   - Jika kosong -> `email_unverified`
2. Profil lengkap
   Wajib terisi:
   - `telepon`
   - `tanggal_lahir`
   - `alamat`
   - `keahlian` (array tidak boleh kosong)
   Jika ada yang kosong -> `profile_incomplete`
3. No-show all-time
   - Hitung `event_participants` status `no_show` untuk user
   - Jika `>= 3` -> `high_no_show_risk`
4. Jadwal bentrok
   - Cek event lain user dengan status `registered` / `confirmed`
   - Jika overlap tanggal+jam -> `schedule_conflict`

Hasil akhir:
- Jika tidak ada alasan -> `auto_approve_eligible = true` dan `review_reasons = null`
- Jika ada alasan -> `auto_approve_eligible = false` dan `review_reasons = [list alasan]`

## 4) Daftar `review_reasons`
Kemungkinan nilai:
- `email_unverified`
- `profile_incomplete`
- `schedule_conflict`
- `high_no_show_risk`

## 5) Mapping Alasan ke Teks UI (Saran)
- `email_unverified` -> "Email belum terverifikasi"
- `profile_incomplete` -> "Profil belum lengkap (telepon, tanggal lahir, alamat, keahlian)"
- `schedule_conflict` -> "Jadwal bentrok dengan event lain"
- `high_no_show_risk` -> "Riwayat no-show tinggi (>= 3)"

## 6) Dampak ke Frontend
Yang harus disesuaikan:
- Hasil join / detail participant: tampilkan label auto-approve + alasan jika ada.
- List peserta (organizer): kolom screening (Eligible / Needs Review).
- Activity history: aman jika `review_reasons` null atau array.

Catatan penting:
- `auto_approve_eligible = true` bukan berarti `confirmed`.
- QR code tetap hanya untuk `confirmed` atau `attended`.

## 7) Contoh Response JSON (Join Event)
```json
{
  "success": true,
  "message": "User successfully joined the event. Check your email for details.",
  "data": {
    "id": 123,
    "user_id": 45,
    "event_id": 9,
    "status": "registered",
    "auto_approve_eligible": false,
    "review_reasons": ["profile_incomplete", "schedule_conflict"],
    "auto_approve_checked_at": "2026-05-31T10:25:00Z",
    "tanggal_daftar": "2026-05-31T10:25:00Z"
  }
}
```

## 8) Seeder Update (Skenario Uji)
Seeder sudah disesuaikan supaya:
- Ada user dengan email verified/tidak.
- Ada user dengan profil lengkap/tidak.
- Ada participant dengan status `no_show`.

Referensi:
- `database/seeders/UserSeeder.php`
- `database/seeders/EventParticipantSeeder.php`

## 9) Langkah Backend
- Jalankan migration: `php artisan migrate`
- (Opsional) jalankan seed ulang: `php artisan db:seed`
