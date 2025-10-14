# Laravel Migrations & Models Setup Guide

## 📋 **Overview**

Panduan lengkap untuk setup Laravel Migrations dan Eloquent Models berdasarkan database schema volunteer management yang sudah ter-normalisasi.

## 🔄 **Urutan Migrations (Dependency Order)**

Migrations harus dibuat sesuai urutan dependencies untuk menghindari foreign key errors:

```
1. users (no dependencies)
2. categories (no dependencies)  
3. locations (no dependencies)
4. organizations (depends on: users, locations)
5. events (depends on: users, categories, locations, organizations)
6. event_participants (depends on: events, users)
7. feedbacks (depends on: events, users)
```

**Note:** `saved_locations` tidak diimplementasikan untuk MVP - fitur untuk future development.

## 🚀 **Step 1: Generate Migration Files**

```bash
# Generate migrations sesuai urutan dependencies
php artisan make:migration create_users_table
php artisan make:migration create_categories_table
php artisan make:migration create_locations_table
php artisan make:migration create_organizations_table
php artisan make:migration create_events_table
php artisan make:migration create_event_participants_table
php artisan make:migration create_feedbacks_table
# php artisan make:migration create_saved_locations_table  # Future feature
```

## 📝 **Step 2: Migration Files Implementation**

### **1. Users Migration**

```php
<?php
// filepath: database/migrations/2024_10_10_000001_create_users_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('telepon', 20)->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->enum('jenis_kelamin', ['laki-laki', 'perempuan', 'lainnya'])->nullable();
            $table->text('alamat')->nullable();
            $table->string('foto_profil', 500)->nullable();
            $table->enum('role', ['volunteer', 'admin', 'organization'])->default('volunteer');
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active');
            $table->rememberToken();
            $table->timestamps();
            
            // Indexes
            $table->index(['role', 'status']);
            $table->index('email'); // untuk login performance
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
};
```

### **2. Categories Migration**

```php
<?php
// filepath: database/migrations/2024_10_10_000002_create_categories_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('nama', 100)->unique();
            $table->text('deskripsi')->nullable();
            $table->string('icon', 100)->nullable();
            $table->string('warna', 7)->default('#3B82F6');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Indexes
            $table->index('is_active');
        });
    }

    public function down()
    {
        Schema::dropIfExists('categories');
    }
};
```

### **3. Locations Migration**

```php
<?php
// filepath: database/migrations/2024_10_10_000003_create_locations_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->text('alamat');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('place_id')->nullable();
            $table->text('alamat_lengkap')->nullable();
            $table->string('kota', 100)->nullable();
            $table->string('provinsi', 100)->nullable();
            $table->string('kode_pos', 10)->nullable();
            $table->string('negara', 100)->default('Indonesia');
            $table->integer('zoom_level')->default(15);
            $table->enum('tipe', ['event', 'organization', 'saved'])->default('event');
            $table->timestamps();
            
            // Indexes untuk performance
            $table->index('place_id');
            $table->index(['latitude', 'longitude']);
            $table->index(['kota', 'provinsi']);
            $table->index('tipe');
        });
    }

    public function down()
    {
        Schema::dropIfExists('locations');
    }
};
```

### **4. Organizations Migration**

```php
<?php
// filepath: database/migrations/2024_10_10_000004_create_organizations_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('organizations', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->text('deskripsi')->nullable();
            $table->string('email')->unique();
            $table->string('telepon', 20)->nullable();
            $table->string('website', 500)->nullable();
            $table->string('logo', 500)->nullable();
            $table->foreignId('location_id')->nullable()->constrained('locations')->onDelete('set null');
            $table->enum('status_verifikasi', ['pending', 'verified', 'rejected'])->default('pending');
            $table->decimal('rating', 3, 2)->default(0.00);
            $table->integer('total_events')->default(0);
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->timestamps();
            
            // Indexes
            $table->index('status_verifikasi');
            $table->index('location_id');
            $table->index(['rating', 'status_verifikasi']); // untuk search & filter
        });
    }

    public function down()
    {
        Schema::dropIfExists('organizations');
    }
};
```

### **5. Events Migration**

```php
<?php
// filepath: database/migrations/2024_10_10_000005_create_events_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->text('deskripsi');
            $table->text('deskripsi_singkat')->nullable();
            $table->string('gambar', 500)->nullable();
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->time('waktu_mulai');
            $table->time('waktu_selesai');
            $table->integer('maks_peserta');
            $table->integer('peserta_saat_ini')->default(0);
            $table->foreignId('location_id')->constrained('locations')->onDelete('restrict');
            $table->enum('status', ['draft', 'published', 'ongoing', 'completed', 'cancelled'])->default('draft');
            $table->text('persyaratan')->nullable();
            $table->text('manfaat')->nullable();
            $table->string('nama_kontak')->nullable();
            $table->string('telepon_kontak', 20)->nullable();
            $table->string('email_kontak')->nullable();
            $table->date('batas_pendaftaran')->nullable();
            $table->decimal('rating', 3, 2)->default(0.00);
            $table->foreignId('category_id')->constrained('categories')->onDelete('restrict');
            $table->foreignId('organization_id')->constrained('organizations')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            
            // Indexes untuk performance queries
            $table->index('status');
            $table->index(['tanggal_mulai', 'tanggal_selesai']);
            $table->index(['location_id', 'category_id']);
            $table->index('organization_id');
            $table->index('user_id'); // user yang membuat event
            $table->index(['status', 'tanggal_mulai']); // untuk event listing
            $table->index(['category_id', 'status']); // untuk filter kategori
        });
    }

    public function down()
    {
        Schema::dropIfExists('events');
    }
};
```

### **6. Event Participants Migration**

```php
<?php
// filepath: database/migrations/2024_10_10_000006_create_event_participants_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('event_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['registered', 'confirmed', 'attended', 'cancelled', 'no_show'])->default('registered');
            $table->timestamp('tanggal_daftar')->useCurrent();
            $table->timestamp('tanggal_konfirmasi')->nullable();
            $table->timestamp('tanggal_hadir')->nullable();
            $table->text('catatan')->nullable();
            $table->timestamps();
            
            // Unique constraint - satu user hanya bisa daftar sekali per event
            $table->unique(['event_id', 'user_id']);
            
            // Indexes
            $table->index('status');
            $table->index('tanggal_daftar');
            $table->index(['event_id', 'status']); // untuk participant management
        });
    }

    public function down()
    {
        Schema::dropIfExists('event_participants');
    }
};
```

### **7. Feedbacks Migration**

```php
<?php
// filepath: database/migrations/2024_10_10_000007_create_feedbacks_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('feedbacks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->tinyInteger('rating')->unsigned();
            $table->text('komentar')->nullable();
            $table->boolean('is_anonim')->default(false);
            $table->boolean('is_disetujui')->default(true);
            $table->timestamps();
            
            // Constraint untuk rating 1-5
            $table->check('rating >= 1 AND rating <= 5');
            
            // Unique constraint - satu user hanya bisa kasih feedback sekali per event
            $table->unique(['event_id', 'user_id']);
            
            // Indexes
            $table->index('rating');
            $table->index('is_disetujui');
            $table->index(['event_id', 'is_disetujui']); // untuk calculate avg rating
        });
    }

    public function down()
    {
        Schema::dropIfExists('feedbacks');
    }
};
```

### **8. Saved Locations Migration**

```php
<?php
// filepath: database/migrations/2024_10_10_000008_create_saved_locations_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('saved_locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('location_id')->constrained('locations')->onDelete('cascade');
            $table->foreignId('organization_id')->constrained('organizations')->onDelete('cascade');
            $table->string('nama_custom')->nullable();
            $table->integer('jumlah_pemakaian')->default(0);
            $table->timestamp('terakhir_digunakan')->nullable();
            $table->timestamps();
            
            // Unique constraint - org tidak bisa save lokasi yang sama 2x
            $table->unique(['organization_id', 'location_id']);
            
            // Indexes
            $table->index(['organization_id', 'jumlah_pemakaian']);
            $table->index('terakhir_digunakan');
        });
    }

    public function down()
    {
        Schema::dropIfExists('saved_locations');
    }
};
```

## 🏗️ **Step 3: Run Migrations**

```bash
# Jalankan migrations sesuai urutan
php artisan migrate

# Cek status migrations
php artisan migrate:status

# Rollback jika ada error
php artisan migrate:rollback

# Fresh install (drop all + migrate)
php artisan migrate:fresh
```

## 📊 **Step 4: Eloquent Models**

### **1. User Model**

```php
<?php
// filepath: app/Models/User.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nama',
        'email',
        'password',
        'telepon',
        'tanggal_lahir',
        'jenis_kelamin',
        'alamat',
        'foto_profil',
        'role',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'tanggal_lahir' => 'date',
        'password' => 'hashed',
    ];

    // Relationships
    public function organization()
    {
        return $this->hasOne(Organization::class);
    }

    public function createdEvents()
    {
        return $this->hasMany(Event::class, 'user_id');
    }

    public function eventParticipations()
    {
        return $this->hasMany(EventParticipant::class);
    }

    public function feedbacks()
    {
        return $this->hasMany(Feedback::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByRole($query, $role)
    {
        return $query->where('role', $role);
    }

    // Accessors
    public function getIsAdminAttribute()
    {
        return $this->role === 'admin';
    }

    public function getIsOrganizationAttribute()
    {
        return $this->role === 'organization';
    }

    public function getIsVolunteerAttribute()
    {
        return $this->role === 'volunteer';
    }
}
```

### **2. Location Model**

```php
<?php
// filepath: app/Models/Location.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'alamat',
        'latitude',
        'longitude',
        'place_id',
        'alamat_lengkap',
        'kota',
        'provinsi',
        'kode_pos',
        'negara',
        'zoom_level',
        'tipe',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'zoom_level' => 'integer',
    ];

    // Relationships
    public function events()
    {
        return $this->hasMany(Event::class);
    }

    public function organizations()
    {
        return $this->hasMany(Organization::class);
    }

    public function savedByOrganizations()
    {
        return $this->belongsToMany(Organization::class, 'saved_locations')
                    ->withPivot(['nama_custom', 'jumlah_pemakaian', 'terakhir_digunakan'])
                    ->withTimestamps();
    }

    // Scopes
    public function scopeByArea($query, $kota = null, $provinsi = null)
    {
        if ($kota) {
            $query->where('kota', $kota);
        }
        if ($provinsi) {
            $query->where('provinsi', $provinsi);
        }
        return $query;
    }

    public function scopeByType($query, $tipe)
    {
        return $query->where('tipe', $tipe);
    }

    public function scopeWithCoordinates($query)
    {
        return $query->whereNotNull('latitude')
                    ->whereNotNull('longitude');
    }

    // Accessors & Mutators
    public function getGoogleMapsUrlAttribute()
    {
        if ($this->place_id) {
            return "https://www.google.com/maps/place/?q=place_id:{$this->place_id}";
        }
        
        if ($this->latitude && $this->longitude) {
            return "https://www.google.com/maps/@{$this->latitude},{$this->longitude},{$this->zoom_level}z";
        }

        return null;
    }

    public function getDirectionsUrlAttribute()
    {
        if ($this->latitude && $this->longitude) {
            return "https://www.google.com/maps/dir/?api=1&destination={$this->latitude},{$this->longitude}";
        }
        return null;
    }

    // Helper Methods
    public function calculateDistance($lat, $lng)
    {
        if (!$this->latitude || !$this->longitude) {
            return null;
        }

        $earthRadius = 6371; // km

        $latDelta = deg2rad($lat - $this->latitude);
        $lngDelta = deg2rad($lng - $this->longitude);

        $a = sin($latDelta / 2) * sin($latDelta / 2) +
             cos(deg2rad($this->latitude)) * cos(deg2rad($lat)) *
             sin($lngDelta / 2) * sin($lngDelta / 2);
        
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c; // distance in km
    }
}
```

### **3. Category Model**

```php
<?php
// filepath: app/Models/Category.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'deskripsi',
        'icon',
        'warna',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Relationships
    public function events()
    {
        return $this->hasMany(Event::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Accessors
    public function getEventsCountAttribute()
    {
        return $this->events()->count();
    }

    public function getPublishedEventsCountAttribute()
    {
        return $this->events()->where('status', 'published')->count();
    }
}
```

### **4. Organization Model**

```php
<?php
// filepath: app/Models/Organization.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'deskripsi',
        'email',
        'telepon',
        'website',
        'logo',
        'location_id',
        'status_verifikasi',
        'rating',
        'total_events',
        'user_id',
    ];

    protected $casts = [
        'rating' => 'decimal:2',
        'total_events' => 'integer',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function events()
    {
        return $this->hasMany(Event::class);
    }

    public function savedLocations()
    {
        return $this->belongsToMany(Location::class, 'saved_locations')
                    ->withPivot(['nama_custom', 'jumlah_pemakaian', 'terakhir_digunakan'])
                    ->withTimestamps();
    }

    // Scopes
    public function scopeVerified($query)
    {
        return $query->where('status_verifikasi', 'verified');
    }

    public function scopePending($query)
    {
        return $query->where('status_verifikasi', 'pending');
    }

    public function scopeByRating($query, $minRating = 0)
    {
        return $query->where('rating', '>=', $minRating);
    }

    // Accessors
    public function getIsVerifiedAttribute()
    {
        return $this->status_verifikasi === 'verified';
    }

    public function getActiveEventsCountAttribute()
    {
        return $this->events()->whereIn('status', ['published', 'ongoing'])->count();
    }

    public function getCompletedEventsCountAttribute()
    {
        return $this->events()->where('status', 'completed')->count();
    }

    // Helper Methods
    public function updateTotalEvents()
    {
        $this->update([
            'total_events' => $this->events()->count()
        ]);
    }

    public function calculateRating()
    {
        $avgRating = $this->events()
                         ->whereHas('feedbacks')
                         ->withAvg('feedbacks', 'rating')
                         ->avg('feedbacks_avg_rating');
        
        $this->update(['rating' => round($avgRating, 2)]);
        
        return $this->rating;
    }
}
```

### **5. Event Model**

```php
<?php
// filepath: app/Models/Event.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'judul',
        'deskripsi',
        'deskripsi_singkat',
        'gambar',
        'tanggal_mulai',
        'tanggal_selesai',
        'waktu_mulai',
        'waktu_selesai',
        'maks_peserta',
        'peserta_saat_ini',
        'location_id',
        'status',
        'persyaratan',
        'manfaat',
        'nama_kontak',
        'telepon_kontak',
        'email_kontak',
        'batas_pendaftaran',
        'rating',
        'category_id',
        'organization_id',
        'user_id',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'waktu_mulai' => 'datetime:H:i',
        'waktu_selesai' => 'datetime:H:i',
        'batas_pendaftaran' => 'date',
        'rating' => 'decimal:2',
        'maks_peserta' => 'integer',
        'peserta_saat_ini' => 'integer',
    ];

    // Relationships
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function participants()
    {
        return $this->hasMany(EventParticipant::class);
    }

    public function volunteers()
    {
        return $this->belongsToMany(User::class, 'event_participants')
                    ->withPivot(['status', 'tanggal_daftar', 'tanggal_konfirmasi', 'tanggal_hadir', 'catatan'])
                    ->withTimestamps();
    }

    public function feedbacks()
    {
        return $this->hasMany(Feedback::class);
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('tanggal_mulai', '>=', now()->toDateString());
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeByLocation($query, $kota = null, $provinsi = null)
    {
        return $query->whereHas('location', function ($q) use ($kota, $provinsi) {
            if ($kota) {
                $q->where('kota', $kota);
            }
            if ($provinsi) {
                $q->where('provinsi', $provinsi);
            }
        });
    }

    public function scopeAvailable($query)
    {
        return $query->where('peserta_saat_ini', '<', 'maks_peserta')
                    ->where('batas_pendaftaran', '>=', now()->toDateString());
    }

    // Accessors
    public function getIsFullAttribute()
    {
        return $this->peserta_saat_ini >= $this->maks_peserta;
    }

    public function getIsRegistrationOpenAttribute()
    {
        return $this->batas_pendaftaran >= now()->toDateString() && !$this->is_full;
    }

    public function getSlotsRemainingAttribute()
    {
        return max(0, $this->maks_peserta - $this->peserta_saat_ini);
    }

    public function getDurationAttribute()
    {
        $start = Carbon::parse($this->waktu_mulai);
        $end = Carbon::parse($this->waktu_selesai);
        
        return $start->diffInHours($end) . ' jam';
    }

    public function getFormattedDateAttribute()
    {
        if ($this->tanggal_mulai->eq($this->tanggal_selesai)) {
            return $this->tanggal_mulai->locale('id')->isoFormat('dddd, D MMMM Y');
        }
        
        return $this->tanggal_mulai->locale('id')->isoFormat('D MMMM') . 
               ' - ' . 
               $this->tanggal_selesai->locale('id')->isoFormat('D MMMM Y');
    }

    public function getFormattedTimeAttribute()
    {
        return Carbon::parse($this->waktu_mulai)->format('H:i') . 
               ' - ' . 
               Carbon::parse($this->waktu_selesai)->format('H:i') . ' WIB';
    }

    // Helper Methods
    public function incrementParticipants()
    {
        $this->increment('peserta_saat_ini');
    }

    public function decrementParticipants()
    {
        $this->decrement('peserta_saat_ini');
    }

    public function updateRating()
    {
        $avgRating = $this->feedbacks()
                         ->where('is_disetujui', true)
                         ->avg('rating');
        
        $this->update(['rating' => round($avgRating, 2)]);
        
        return $this->rating;
    }

    public function canUserRegister(User $user)
    {
        // Check if registration is open
        if (!$this->is_registration_open) {
            return false;
        }

        // Check if user already registered
        if ($this->participants()->where('user_id', $user->id)->exists()) {
            return false;
        }

        // Check if user is volunteer
        if ($user->role !== 'volunteer') {
            return false;
        }

        return true;
    }
}
```

### **6. EventParticipant Model**

```php
<?php
// filepath: app/Models/EventParticipant.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventParticipant extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'user_id',
        'status',
        'tanggal_daftar',
        'tanggal_konfirmasi',
        'tanggal_hadir',
        'catatan',
    ];

    protected $casts = [
        'tanggal_daftar' => 'datetime',
        'tanggal_konfirmasi' => 'datetime',
        'tanggal_hadir' => 'datetime',
    ];

    // Relationships
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeRegistered($query)
    {
        return $query->where('status', 'registered');
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function scopeAttended($query)
    {
        return $query->where('status', 'attended');
    }

    // Accessors
    public function getIsConfirmedAttribute()
    {
        return in_array($this->status, ['confirmed', 'attended']);
    }

    public function getIsAttendedAttribute()
    {
        return $this->status === 'attended';
    }

    // Helper Methods
    public function confirm()
    {
        $this->update([
            'status' => 'confirmed',
            'tanggal_konfirmasi' => now(),
        ]);

        // Update event participant count
        $this->event->incrementParticipants();
    }

    public function markAsAttended()
    {
        $this->update([
            'status' => 'attended',
            'tanggal_hadir' => now(),
        ]);
    }

    public function cancel()
    {
        $oldStatus = $this->status;
        
        $this->update(['status' => 'cancelled']);

        // If was confirmed, decrement participant count
        if ($oldStatus === 'confirmed') {
            $this->event->decrementParticipants();
        }
    }
}
```

### **7. Feedback Model**

```php
<?php
// filepath: app/Models/Feedback.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'user_id',
        'rating',
        'komentar',
        'is_anonim',
        'is_disetujui',
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_anonim' => 'boolean',
        'is_disetujui' => 'boolean',
    ];

    // Relationships
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeApproved($query)
    {
        return $query->where('is_disetujui', true);
    }

    public function scopeByRating($query, $rating)
    {
        return $query->where('rating', $rating);
    }

    public function scopeWithComments($query)
    {
        return $query->whereNotNull('komentar')
                    ->where('komentar', '!=', '');
    }

    // Accessors
    public function getUserNameAttribute()
    {
        if ($this->is_anonim) {
            return 'Anonim';
        }
        
        return $this->user->nama;
    }

    public function getRatingStarsAttribute()
    {
        return str_repeat('⭐', $this->rating);
    }
}
```

### **8. SavedLocation Model**

```php
<?php
// filepath: app/Models/SavedLocation.php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class SavedLocation extends Pivot
{
    protected $table = 'saved_locations';
    
    public $incrementing = true;

    protected $fillable = [
        'location_id',
        'organization_id',
        'nama_custom',
        'jumlah_pemakaian',
        'terakhir_digunakan',
    ];

    protected $casts = [
        'jumlah_pemakaian' => 'integer',
        'terakhir_digunakan' => 'datetime',
    ];

    // Relationships
    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    // Helper Methods
    public function incrementUsage()
    {
        $this->increment('jumlah_pemakaian');
        $this->update(['terakhir_digunakan' => now()]);
    }

    // Accessors
    public function getDisplayNameAttribute()
    {
        return $this->nama_custom ?: $this->location->nama;
    }
}
```

## 🔧 **Step 5: Model Factories (Optional)**

### **Generate Factories**

```bash
php artisan make:factory CategoryFactory
php artisan make:factory LocationFactory
php artisan make:factory OrganizationFactory
php artisan make:factory EventFactory
```

### **Category Factory Example**

```php
<?php
// filepath: database/factories/CategoryFactory.php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    public function definition()
    {
        $categories = [
            ['nama' => 'Pendidikan', 'icon' => 'graduation-cap', 'warna' => '#3B82F6'],
            ['nama' => 'Kesehatan', 'icon' => 'heart', 'warna' => '#EF4444'],
            ['nama' => 'Lingkungan', 'icon' => 'leaf', 'warna' => '#10B981'],
            ['nama' => 'Sosial', 'icon' => 'users', 'warna' => '#F59E0B'],
            ['nama' => 'Teknologi', 'icon' => 'laptop', 'warna' => '#8B5CF6'],
            ['nama' => 'Kemanusiaan', 'icon' => 'hand-heart', 'warna' => '#EC4899'],
        ];

        $category = $this->faker->randomElement($categories);

        return [
            'nama' => $category['nama'],
            'deskripsi' => $this->faker->sentence(),
            'icon' => $category['icon'],
            'warna' => $category['warna'],
            'is_active' => true,
        ];
    }
}
```

## 🌱 **Step 6: Seeders**

### **Generate Seeders**

```bash
php artisan make:seeder CategorySeeder
php artisan make:seeder UserSeeder
php artisan make:seeder LocationSeeder
php artisan make:seeder OrganizationSeeder
php artisan make:seeder EventSeeder
php artisan make:seeder EventParticipantSeeder
php artisan make:seeder FeedbackSeeder
```

### **1. CategorySeeder**

```php
<?php
// filepath: database/seeders/CategorySeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            [
                'nama' => 'Pendidikan',
                'deskripsi' => 'Kegiatan volunteer di bidang pendidikan seperti mengajar, bimbingan belajar, dan pelatihan',
                'icon' => 'graduation-cap',
                'warna' => '#3B82F6',
                'is_active' => true,
            ],
            [
                'nama' => 'Kesehatan',
                'deskripsi' => 'Kegiatan volunteer di bidang kesehatan seperti donor darah, penyuluhan kesehatan',
                'icon' => 'heart',
                'warna' => '#EF4444',
                'is_active' => true,
            ],
            [
                'nama' => 'Lingkungan',
                'deskripsi' => 'Kegiatan volunteer untuk menjaga lingkungan seperti bersih-bersih, penanaman pohon',
                'icon' => 'leaf',
                'warna' => '#10B981',
                'is_active' => true,
            ],
            [
                'nama' => 'Sosial',
                'deskripsi' => 'Kegiatan volunteer sosial kemasyarakatan seperti bakti sosial, bantuan bencana',
                'icon' => 'users',
                'warna' => '#F59E0B',
                'is_active' => true,
            ],
            [
                'nama' => 'Teknologi',
                'deskripsi' => 'Kegiatan volunteer di bidang teknologi seperti pelatihan komputer, literasi digital',
                'icon' => 'laptop',
                'warna' => '#8B5CF6',
                'is_active' => true,
            ],
            [
                'nama' => 'Kemanusiaan',
                'deskripsi' => 'Kegiatan volunteer kemanusiaan seperti bantuan untuk anak yatim, lansia',
                'icon' => 'hand-heart',
                'warna' => '#EC4899',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            DB::table('categories')->insert(array_merge($category, [
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]));
        }

        $this->command->info('Categories seeded successfully!');
    }
}
```

### **2. UserSeeder**

```php
<?php
// filepath: database/seeders/UserSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    public function run()
    {
        $users = [
            // Admin System
            [
                'nama' => 'Admin Volunteer System',
                'email' => 'admin@volunteer.local',
                'password' => Hash::make('password123'),
                'telepon' => '081234567890',
                'role' => 'admin',
                'status' => 'active',
                'email_verified_at' => Carbon::now(),
            ],
            
            // Organization Users
            [
                'nama' => 'Admin YPN',
                'email' => 'admin@ypn.org',
                'password' => Hash::make('password123'),
                'telepon' => '081234567891',
                'role' => 'organization',
                'status' => 'active',
                'email_verified_at' => Carbon::now(),
            ],
            [
                'nama' => 'Admin KLH',
                'email' => 'admin@klh.org',
                'password' => Hash::make('password123'),
                'telepon' => '081234567892',
                'role' => 'organization',
                'status' => 'active',
                'email_verified_at' => Carbon::now(),
            ],
            
            // Volunteer Users
            [
                'nama' => 'John Volunteer',
                'email' => 'john@volunteer.com',
                'password' => Hash::make('password123'),
                'telepon' => '081234567893',
                'tanggal_lahir' => '1995-05-15',
                'jenis_kelamin' => 'laki-laki',
                'alamat' => 'Jl. Volunteer No. 123, Jakarta',
                'role' => 'volunteer',
                'status' => 'active',
                'email_verified_at' => Carbon::now(),
            ],
            [
                'nama' => 'Jane Volunteer',
                'email' => 'jane@volunteer.com',
                'password' => Hash::make('password123'),
                'telepon' => '081234567894',
                'tanggal_lahir' => '1992-08-20',
                'jenis_kelamin' => 'perempuan',
                'alamat' => 'Jl. Relawan No. 456, Jakarta',
                'role' => 'volunteer',
                'status' => 'active',
                'email_verified_at' => Carbon::now(),
            ],
            [
                'nama' => 'Mike Volunteer',
                'email' => 'mike@volunteer.com',
                'password' => Hash::make('password123'),
                'telepon' => '081234567895',
                'tanggal_lahir' => '1998-03-10',
                'jenis_kelamin' => 'laki-laki',
                'alamat' => 'Jl. Bakti No. 789, Jakarta',
                'role' => 'volunteer',
                'status' => 'active',
                'email_verified_at' => Carbon::now(),
            ],
        ];

        foreach ($users as $user) {
            DB::table('users')->insert(array_merge($user, [
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]));
        }

        $this->command->info('Users seeded successfully!');
    }
}
```

### **3. LocationSeeder**

```php
<?php
// filepath: database/seeders/LocationSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class LocationSeeder extends Seeder
{
    public function run()
    {
        $locations = [
            // Organization Locations
            [
                'nama' => 'Kantor YPN Jakarta',
                'alamat' => 'Jl. Pendidikan No. 123, Jakarta Pusat',
                'latitude' => -6.2088,
                'longitude' => 106.8456,
                'kota' => 'Jakarta',
                'provinsi' => 'DKI Jakarta',
                'negara' => 'Indonesia',
                'tipe' => 'organization',
            ],
            [
                'nama' => 'Kantor KLH Bandung',
                'alamat' => 'Jl. Hijau No. 456, Bandung',
                'latitude' => -6.9175,
                'longitude' => 107.6191,
                'kota' => 'Bandung',
                'provinsi' => 'Jawa Barat',
                'negara' => 'Indonesia',
                'tipe' => 'organization',
            ],
            
            // Event Locations
            [
                'nama' => 'SDN 01 Jakarta Pusat',
                'alamat' => 'Jl. Merdeka No. 10, Jakarta Pusat',
                'latitude' => -6.1751,
                'longitude' => 106.8650,
                'kota' => 'Jakarta',
                'provinsi' => 'DKI Jakarta',
                'negara' => 'Indonesia',
                'tipe' => 'event',
            ],
            [
                'nama' => 'Taman Kota Bandung',
                'alamat' => 'Jl. Taman No. 5, Bandung',
                'latitude' => -6.9147,
                'longitude' => 107.6098,
                'kota' => 'Bandung',
                'provinsi' => 'Jawa Barat',
                'negara' => 'Indonesia',
                'tipe' => 'event',
            ],
            [
                'nama' => 'Community Center Jakarta',
                'alamat' => 'Jl. Kemang Raya No. 25, Jakarta Selatan',
                'latitude' => -6.2615,
                'longitude' => 106.8106,
                'kota' => 'Jakarta',
                'provinsi' => 'DKI Jakarta',
                'negara' => 'Indonesia',
                'tipe' => 'event',
            ],
            [
                'nama' => 'SMP Negeri 15 Jakarta',
                'alamat' => 'Jl. Pendidikan No. 45, Jakarta Timur',
                'latitude' => -6.2146,
                'longitude' => 106.8451,
                'kota' => 'Jakarta',
                'provinsi' => 'DKI Jakarta',
                'negara' => 'Indonesia',
                'tipe' => 'event',
            ],
            [
                'nama' => 'Pantai Ancol',
                'alamat' => 'Jl. Lodan Timur No. 7, Jakarta Utara',
                'latitude' => -6.1223,
                'longitude' => 106.8420,
                'kota' => 'Jakarta',
                'provinsi' => 'DKI Jakarta',
                'negara' => 'Indonesia',
                'tipe' => 'event',
            ],
        ];

        foreach ($locations as $location) {
            DB::table('locations')->insert(array_merge($location, [
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]));
        }

        $this->command->info('Locations seeded successfully!');
    }
}
```

### **4. OrganizationSeeder**

```php
<?php
// filepath: database/seeders/OrganizationSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OrganizationSeeder extends Seeder
{
    public function run()
    {
        $organizations = [
            [
                'nama' => 'Yayasan Pendidikan Nusantara',
                'deskripsi' => 'Yayasan yang bergerak di bidang pendidikan untuk membantu anak-anak kurang mampu mendapatkan akses pendidikan yang layak',
                'email' => 'info@ypn.org',
                'telepon' => '021-12345678',
                'website' => 'https://ypn.org',
                'location_id' => 1, // Kantor YPN Jakarta
                'status_verifikasi' => 'verified',
                'rating' => 4.8,
                'total_events' => 0,
                'user_id' => 2, // Admin YPN
            ],
            [
                'nama' => 'Komunitas Lingkungan Hijau',
                'deskripsi' => 'Komunitas yang fokus pada pelestarian lingkungan dan kampanye go green untuk masa depan yang lebih baik',
                'email' => 'info@lingkunganhijau.org',
                'telepon' => '022-87654321',
                'website' => 'https://lingkunganhijau.org',
                'location_id' => 2, // Kantor KLH Bandung
                'status_verifikasi' => 'verified',
                'rating' => 4.6,
                'total_events' => 0,
                'user_id' => 3, // Admin KLH
            ],
        ];

        foreach ($organizations as $organization) {
            DB::table('organizations')->insert(array_merge($organization, [
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]));
        }

        $this->command->info('Organizations seeded successfully!');
    }
}
```

### **5. EventSeeder**

```php
<?php
// filepath: database/seeders/EventSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class EventSeeder extends Seeder
{
    public function run()
    {
        $events = [
            [
                'judul' => 'Mengajar Anak Sekolah Dasar - Matematika',
                'deskripsi' => 'Program volunteer mengajar matematika untuk siswa SD kelas 4-6. Membantu anak-anak memahami konsep dasar matematika dengan cara yang menyenangkan dan mudah dipahami.',
                'deskripsi_singkat' => 'Mengajar matematika untuk siswa SD',
                'tanggal_mulai' => Carbon::now()->addDays(7)->toDateString(),
                'tanggal_selesai' => Carbon::now()->addDays(7)->toDateString(),
                'waktu_mulai' => '08:00:00',
                'waktu_selesai' => '12:00:00',
                'maks_peserta' => 20,
                'peserta_saat_ini' => 0,
                'location_id' => 3, // SDN 01 Jakarta Pusat
                'status' => 'published',
                'persyaratan' => 'Mampu mengajar matematika tingkat SD, Sabar dengan anak-anak, Minimal lulusan SMA',
                'manfaat' => 'Sertifikat volunteer, Pengalaman mengajar, Networking dengan sesama volunteer',
                'nama_kontak' => 'Siti Nurhaliza',
                'telepon_kontak' => '081234567890',
                'email_kontak' => 'kontak@ypn.org',
                'batas_pendaftaran' => Carbon::now()->addDays(5)->toDateString(),
                'category_id' => 1, // Pendidikan
                'organization_id' => 1, // YPN
                'user_id' => 2, // Admin YPN
            ],
            [
                'judul' => 'Bersih-Bersih Pantai Ancol',
                'deskripsi' => 'Kegiatan gotong royong membersihkan pantai dari sampah plastik dan limbah lainnya. Mari bersama-sama menjaga kebersihan pantai untuk kelestarian ekosistem laut.',
                'deskripsi_singkat' => 'Bersih-bersih pantai dari sampah plastik',
                'tanggal_mulai' => Carbon::now()->addDays(10)->toDateString(),
                'tanggal_selesai' => Carbon::now()->addDays(10)->toDateString(),
                'waktu_mulai' => '07:00:00',
                'waktu_selesai' => '11:00:00',
                'maks_peserta' => 50,
                'peserta_saat_ini' => 0,
                'location_id' => 7, // Pantai Ancol
                'status' => 'published',
                'persyaratan' => 'Sehat jasmani, Membawa sarung tangan, Pakaian yang nyaman untuk beraktivitas',
                'manfaat' => 'Sertifikat volunteer, Pengalaman peduli lingkungan, Snack dan makan siang gratis',
                'nama_kontak' => 'Budi Santoso',
                'telepon_kontak' => '081234567891',
                'email_kontak' => 'kontak@lingkunganhijau.org',
                'batas_pendaftaran' => Carbon::now()->addDays(8)->toDateString(),
                'category_id' => 3, // Lingkungan
                'organization_id' => 2, // KLH
                'user_id' => 3, // Admin KLH
            ],
            [
                'judul' => 'Workshop Teknologi untuk Remaja',
                'deskripsi' => 'Workshop pengenalan teknologi dan programming untuk remaja. Belajar dasar-dasar coding, web development, dan literasi digital untuk masa depan yang lebih cerah.',
                'deskripsi_singkat' => 'Workshop coding dan teknologi untuk remaja',
                'tanggal_mulai' => Carbon::now()->addDays(14)->toDateString(),
                'tanggal_selesai' => Carbon::now()->addDays(14)->toDateString(),
                'waktu_mulai' => '13:00:00',
                'waktu_selesai' => '17:00:00',
                'maks_peserta' => 30,
                'peserta_saat_ini' => 0,
                'location_id' => 5, // Community Center Jakarta
                'status' => 'published',
                'persyaratan' => 'Memiliki pengetahuan dasar komputer, Mampu mengajar remaja, Membawa laptop pribadi',
                'manfaat' => 'Sertifikat volunteer, Pengalaman mengajar teknologi, Networking dengan tech community',
                'nama_kontak' => 'Ahmad Fauzi',
                'telepon_kontak' => '081234567892',
                'email_kontak' => 'kontak@ypn.org',
                'batas_pendaftaran' => Carbon::now()->addDays(12)->toDateString(),
                'category_id' => 5, // Teknologi
                'organization_id' => 1, // YPN
                'user_id' => 2, // Admin YPN
            ],
            [
                'judul' => 'Bakti Sosial untuk Anak Yatim',
                'deskripsi' => 'Kegiatan bakti sosial memberikan bantuan dan hiburan untuk anak-anak yatim di panti asuhan. Berbagi kebahagiaan dan memberikan motivasi untuk masa depan mereka.',
                'deskripsi_singkat' => 'Bakti sosial dan hiburan untuk anak yatim',
                'tanggal_mulai' => Carbon::now()->addDays(21)->toDateString(),
                'tanggal_selesai' => Carbon::now()->addDays(21)->toDateString(),
                'waktu_mulai' => '09:00:00',
                'waktu_selesai' => '15:00:00',
                'maks_peserta' => 25,
                'peserta_saat_ini' => 0,
                'location_id' => 5, // Community Center Jakarta
                'status' => 'draft',
                'persyaratan' => 'Suka berinteraksi dengan anak-anak, Bisa membawa hiburan atau permainan, Berpakaian rapi dan sopan',
                'manfaat' => 'Sertifikat volunteer, Pengalaman sosial yang berharga, Makan siang gratis',
                'nama_kontak' => 'Dewi Sartika',
                'telepon_kontak' => '081234567893',
                'email_kontak' => 'kontak@ypn.org',
                'batas_pendaftaran' => Carbon::now()->addDays(19)->toDateString(),
                'category_id' => 6, // Kemanusiaan
                'organization_id' => 1, // YPN
                'user_id' => 2, // Admin YPN
            ],
        ];

        foreach ($events as $event) {
            DB::table('events')->insert(array_merge($event, [
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]));
        }

        $this->command->info('Events seeded successfully!');
    }
}
```

### **6. EventParticipantSeeder**

```php
<?php
// filepath: database/seeders/EventParticipantSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class EventParticipantSeeder extends Seeder
{
    public function run()
    {
        $participants = [
            // Event 1: Mengajar SD Matematika (event_id: 1)
            [
                'event_id' => 1,
                'user_id' => 4, // John Volunteer
                'status' => 'confirmed',
                'tanggal_daftar' => Carbon::now()->subDays(3),
                'tanggal_konfirmasi' => Carbon::now()->subDays(2),
                'catatan' => 'Siap membantu mengajar matematika',
            ],
            [
                'event_id' => 1,
                'user_id' => 5, // Jane Volunteer
                'status' => 'confirmed',
                'tanggal_daftar' => Carbon::now()->subDays(2),
                'tanggal_konfirmasi' => Carbon::now()->subDay(),
                'catatan' => 'Pengalaman mengajar private matematika',
            ],
            [
                'event_id' => 1,
                'user_id' => 6, // Mike Volunteer
                'status' => 'registered',
                'tanggal_daftar' => Carbon::now()->subDay(),
                'catatan' => 'Baru pertama kali volunteer mengajar',
            ],

            // Event 2: Bersih-bersih Pantai (event_id: 2)
            [
                'event_id' => 2,
                'user_id' => 4, // John Volunteer
                'status' => 'confirmed',
                'tanggal_daftar' => Carbon::now()->subDays(4),
                'tanggal_konfirmasi' => Carbon::now()->subDays(3),
                'catatan' => 'Punya pengalaman bersih-bersih pantai sebelumnya',
            ],
            [
                'event_id' => 2,
                'user_id' => 6, // Mike Volunteer
                'status' => 'confirmed',
                'tanggal_daftar' => Carbon::now()->subDays(2),
                'tanggal_konfirmasi' => Carbon::now()->subDay(),
                'catatan' => 'Peduli lingkungan, siap membantu',
            ],

            // Event 3: Workshop Teknologi (event_id: 3)
            [
                'event_id' => 3,
                'user_id' => 5, // Jane Volunteer
                'status' => 'registered',
                'tanggal_daftar' => Carbon::now()->subDays(1),
                'catatan' => 'Background IT, siap berbagi ilmu',
            ],
            [
                'event_id' => 3,
                'user_id' => 6, // Mike Volunteer
                'status' => 'registered',
                'tanggal_daftar' => Carbon::now(),
                'catatan' => 'Fresh graduate IT, ingin berkontribusi',
            ],
        ];

        foreach ($participants as $participant) {
            DB::table('event_participants')->insert(array_merge($participant, [
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]));
        }

        // Update peserta_saat_ini di events table
        DB::table('events')->where('id', 1)->update(['peserta_saat_ini' => 2]); // 2 confirmed
        DB::table('events')->where('id', 2)->update(['peserta_saat_ini' => 2]); // 2 confirmed
        DB::table('events')->where('id', 3)->update(['peserta_saat_ini' => 0]); // 0 confirmed (masih registered)

        $this->command->info('Event Participants seeded successfully!');
    }
}
```

### **7. FeedbackSeeder**

```php
<?php
// filepath: database/seeders/FeedbackSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class FeedbackSeeder extends Seeder
{
    public function run()
    {
        $feedbacks = [
            // Feedbacks untuk events yang sudah completed (simulasi)
            // Misalkan ada event sebelumnya yang sudah selesai
            
            // Feedback untuk event mengajar (simulasi event completed)
            [
                'event_id' => 1, // Mengajar SD Matematika
                'user_id' => 4, // John Volunteer
                'rating' => 5,
                'komentar' => 'Event yang sangat bermanfaat! Anak-anak antusias belajar matematika. Organisasi sangat baik dalam koordinasi.',
                'is_anonim' => false,
                'is_disetujui' => true,
            ],
            [
                'event_id' => 1, // Mengajar SD Matematika
                'user_id' => 5, // Jane Volunteer
                'rating' => 4,
                'komentar' => 'Pengalaman yang menyenangkan mengajar anak-anak. Fasilitas cukup memadai, namun perlu lebih banyak alat peraga.',
                'is_anonim' => false,
                'is_disetujui' => true,
            ],
            
            // Feedback untuk event bersih pantai
            [
                'event_id' => 2, // Bersih-bersih Pantai
                'user_id' => 4, // John Volunteer
                'rating' => 5,
                'komentar' => 'Event yang sangat baik untuk lingkungan! Koordinasi panitia excellent, dapat sertifikat dan snack.',
                'is_anonim' => false,
                'is_disetujui' => true,
            ],
            [
                'event_id' => 2, // Bersih-bersih Pantai
                'user_id' => 6, // Mike Volunteer
                'rating' => 4,
                'komentar' => 'Kegiatan yang bermakna untuk menjaga kebersihan pantai. Semoga bisa rutin diadakan.',
                'is_anonim' => true, // anonim
                'is_disetujui' => true,
            ],
            
            // Feedback untuk workshop teknologi (simulasi)
            [
                'event_id' => 3, // Workshop Teknologi
                'user_id' => 5, // Jane Volunteer
                'rating' => 5,
                'komentar' => 'Workshop yang sangat bermanfaat! Materi up-to-date dan peserta sangat antusias belajar coding.',
                'is_anonim' => false,
                'is_disetujui' => true,
            ],
            
            // Feedback dengan rating rendah (untuk testing)
            [
                'event_id' => 3, // Workshop Teknologi
                'user_id' => 6, // Mike Volunteer
                'rating' => 3,
                'komentar' => 'Event cukup baik tapi perlu perbaikan di fasilitas laptop. Beberapa laptop tidak berfungsi dengan baik.',
                'is_anonim' => false,
                'is_disetujui' => true,
            ],
            
            // Feedback pending approval (untuk testing)
            [
                'event_id' => 1, // Mengajar SD Matematika
                'user_id' => 6, // Mike Volunteer
                'rating' => 2,
                'komentar' => 'Kurang puas dengan koordinasi panitia. Banyak yang tidak jelas dan terlambat memberikan info.',
                'is_anonim' => true,
                'is_disetujui' => false, // pending approval
            ],
        ];

        foreach ($feedbacks as $feedback) {
            DB::table('feedbacks')->insert(array_merge($feedback, [
                'created_at' => Carbon::now()->subDays(rand(1, 10)), // feedback dari 1-10 hari lalu
                'updated_at' => Carbon::now()->subDays(rand(1, 10)),
            ]));
        }

        // Update rating di events table berdasarkan approved feedbacks
        $this->updateEventRatings();

        $this->command->info('Feedbacks seeded successfully!');
    }

    private function updateEventRatings()
    {
        // Event 1: Rating dari feedback John (5) + Jane (4) = 4.5
        DB::table('events')->where('id', 1)->update([
            'rating' => 4.5 // (5+4)/2
        ]);

        // Event 2: Rating dari feedback John (5) + Mike (4) = 4.5  
        DB::table('events')->where('id', 2)->update([
            'rating' => 4.5 // (5+4)/2
        ]);

        // Event 3: Rating dari feedback Jane (5) + Mike (3) = 4.0
        DB::table('events')->where('id', 3)->update([
            'rating' => 4.0 // (5+3)/2
        ]);
    }
}
```
## 📁 **Database Seeder (Updated Order)**

```php
<?php
// filepath: database/seeders/DatabaseSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // URUTAN CRITICAL: Parent tables dulu!
        $this->call([
            // 1. Master Data (No Dependencies)
            CategorySeeder::class,          // ← PERTAMA
            
            // 2. Base Users (No Dependencies)  
            UserSeeder::class,              // ← KEDUA
            
            // 3. Locations (No Dependencies)
            LocationSeeder::class,          // ← KETIGA
            
            // 4. Organizations (FK: user_id, location_id)
            OrganizationSeeder::class,      // ← KEEMPAT
            
            // 5. Events (FK: user_id, category_id, location_id, organization_id)
            EventSeeder::class,             // ← KELIMA
            
            // 6. Event Participants (FK: event_id, user_id)
            EventParticipantSeeder::class,  // ← KEENAM
            
            // 7. Feedbacks (FK: event_id, user_id)
            FeedbackSeeder::class,          // ← TERAKHIR
        ]);
    }
}
```

## 🔄 **Migration Commands (Proper Order):**

### **Development Workflow:**
```bash
# 1. Create migrations (sesuai urutan dependency)
php artisan make:migration create_users_table
php artisan make:migration create_categories_table
php artisan make:migration create_locations_table
php artisan make:migration create_organizations_table
php artisan make:migration create_events_table
php artisan make:migration create_event_participants_table
php artisan make:migration create_feedbacks_table

# 2. Run migrations
php artisan migrate

# 3. Create seeders (sesuai urutan dependency)
php artisan make:seeder CategorySeeder
php artisan make:seeder UserSeeder
php artisan make:seeder LocationSeeder
php artisan make:seeder OrganizationSeeder
php artisan make:seeder EventSeeder
php artisan make:seeder EventParticipantSeeder
php artisan make:seeder FeedbackSeeder

# 4. Run seeders
php artisan db:seed
```

### **Production/Fresh Setup:**
```bash
# Fresh start with seeding
php artisan migrate:fresh --seed

# Atau step by step
php artisan migrate:fresh
php artisan db:seed
```

## ⚡ **Step 7: Testing**

### **Test Models**

```bash
php artisan tinker

# Test relationships
>>> $user = App\Models\User::first()
>>> $user->organization
>>> $user->createdEvents

>>> $event = App\Models\Event::first()
>>> $event->location
>>> $event->category
>>> $event->participants

>>> $org = App\Models\Organization::first()
>>> $org->savedLocations
>>> $org->events
```

## 🚀 **Ready to Use!**

Database structure sudah siap dengan:
- ✅ **Migrations** - terurut sesuai dependencies
- ✅ **Models** - dengan relationships lengkap
- ✅ **Indexes** - untuk performance optimal
- ✅ **Scopes** - untuk query yang sering dipakai
- ✅ **Accessors** - untuk data formatting
- ✅ **Helper Methods** - untuk business logic

**Next Steps:**
1. Jalankan migrations: `php artisan migrate`
2. Setup seeders untuk sample data
3. Test relationships di tinker
4. Mulai buat Controllers & API endpoints! 🎉