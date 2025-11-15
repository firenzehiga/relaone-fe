# 💚 RelaOne - Volunteer App (Frontend)

<div align="center">
  <img src="./public/images/logo_fe.png" alt="RelaOne Logo" width="150" height="150">
  
<p>
</p>

[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white&style=flat-square)](https://react.dev) 
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?logo=tailwindcss&logoColor=white&style=flat-square)](https://tailwindcss.com) 
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white)](https://vite.dev/)
[![JavaScript](https://shields.io/badge/JavaScript-F7DF1E?logo=JavaScript&logoColor=000&style=flat-square)](http://javascript.com/)
</div>

---

## 🌀 Tentang RelaOne

**RelaOne** atau **Volunteer Activity Manager** merupakan platform berbasis web yang bertujuan membantu menghubungkan organisasi penyelenggara kegiatan sosial dengan para relawan (volunteer) yang bersedia berkontribusi dalam aktivitas masyarakat. Mereka  dapat mencari, melihat detail kegiatan, serta mendaftar secara langsung tanpa harus melalui proses manual. Semua ini bertujuan untuk mempermudah koordinasi kegiatan sosial dan akses informasi.

---

## ✨ Fitur Utama

### 🧑 **Untuk Volunteer/Relawan**
- **Event Searching** - Temukan kegiatan relawan yang ingin diikuti sesuai preferensi
- **Easy Regist** - Sistem pendaftaran ke suatu kegiatan yang simpel dengan konfirmasi real-time  
- **Tracking Activities** - Pantau riwayat kegiatan anda

### 🏢 **Untuk Organisasi**
- **Location Management** - Kelola semua lokasi untuk kegiatan yang dibuat
- **Event Management** - Kelola semua kegiatan yang anda selenggarakan
- **Participant Management** - Kelola semua partisipan kegiatan anda dengan mudah dan simpel
- **Check-In via Barcode** - Fitur absensi menggunakan Scan Kode QR untuk mempermudah proses pendataan

### 🛡️ **Untuk Admin**
- **Full Data Management** - Kelola semua data untuk monitoring
- **Dashboard Analytics** - Analitik data dalam bentuk chart

---

## 🚀 **Teknologi yang Digunakan**

### Frontend Stack
- **React 19** - Library Javascript modern dengan hooks
- **Axios** - Library JavaScript berbasis promise untuk membuat permintaan HTTP dari browser
- **DayJs** - Library Javascript minimalis yang memanipulasi, dan menampilkan tanggal dan waktu
- **Vite** - Build tool yang super cepat
- **Tailwind CSS 3** - Utility-first CSS framework
- **Chakra UI** - Library UI modern
- **React Hot Toast** - Library Push Notification ringan
- **React Datatable Component** - Library komponen untuk visualisasi data dalam bentuk tabel
- **Sweet Alert** - Library Popup Notification dengan tampilan menarik
- **QR Code React** - Library untuk membuat dan menampilkan kode QR
- **HTML5 QR Code** - Library untuk memproses gambar dari kamera dan membaca kode QR
- **ReCharts** - Library grafi berbasis JavaScript yang digunakan untuk membuat visualisasi data     
- **Framer Motion** - Animasi yang smooth dan engaging
- **React Query** - Data fetching dan state management
- **Zustand** - Lightweight state management
- **React Router** - Navigation dan routing

### UI/UX Features
- **Responsive Design** - Tampil sempurna di semua device
- **Loading Animations** - Interactive loading states
- **Modern Components** - Reusable dan maintainable
- **Accessible** - Memenuhi standar accessibility

---

## 📄 **License & Ownership**

Aplikasi ini dikembangkan sebagai bagian dari project kolaboratif pendidikan.

Pengembangan utama frontend, desain, dan user experience dilakukan oleh:

- [**Firenze Higa**](https://github.com/firenzehiga)

Kontributor pendukung yang turut membantu dalam proses pengembangan:

- [**Miftah Adz**](https://github.com/miftahadzdzaudanislam) – Contributor  
- [**Wahyu Andrianto**](https://github.com/Wahyu2204) – Contributor

📧 **Contact**: firenzehiga@gmail.com  
🐙 **GitHub**: [@firenzehiga](https://github.com/firenzehiga)

---

## 🙏 **Acknowledgments**

- Tim frontend yang membantu dalam mengembangkan aplikasi ini.

---

## 🔗 Related Repositories

- **Backend API**: [relaone-backend](https://github.com/firenzehiga/relaone-be) - REST API server untuk volunteer activity manager

> **Note**: Aplikasi ini adalah bagian dari ekosistem RelaOne - platform volunteer management yang terdiri dari web frontend, dan backend API.


## 🚀 Requirements

- Node.js >= 18.0.0
- NPM atau Yarn
- Modern Browser (Chrome, Firefox, Safari, Edge)

## 📦 Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/firenzehiga/humanify
cd nama-folder
```

### 2. Install Dependencies

```bash
# Install dependencies dengan npm
npm install

# Atau dengan yarn
yarn install
```

### 3. Environment Configuration

```bash
# Copy environment file
cp .env.example .env
```

Update konfigurasi di file `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 4. Start Development Server

```bash
# Start development server
npm run dev

# Atau dengan yarn
yarn dev
```

Aplikasi akan berjalan di `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── _api/                # Axios Instance and interceptor
├── _hooks/              # Custom hooks for service functions
├── _services/           # Custom services for API calls
├── assets/              # Static assets (images, icons)
├── components/          # Reusable React components
│   ├── admin/           # Admin-specific components
│   ├── auth/            # Auth Protected Route specific components
│   ├── common/          # Common UI components
│   ├── fallback/        # Custom components for any fallback ui
│   ├── layout/          # Layout components (Header, Footer)
│   ├── organization/    # Organization-specific components
│   ├── ui/              # UI components (Button, Modal, etc.)
│   └── volunteer/       # Volunteer-specific components
├── layout/              # Page Layout
├── pages/               # Page components
├── store/               # State management (Zustand)
├── utils/               # Utility functions
├── App.jsx              # Main App component
├── .env.example         # App Environment
└── main.jsx             # Application entry point
```

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build untuk production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code dengan Prettier
npm run format
```

## 🔧 Configuration

### Tailwind CSS
Konfigurasi Tailwind tersedia di `tailwind.config.js`:

```js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {...},
        secondary: {...}
      }
    }
  }
}
```

### Vite Configuration
Konfigurasi Vite tersedia di `vite.config.js`:

```js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8000'
    }
  }
})
```

## 🤝 Contributing

1. Fork repository
2. Buat branch baru: `git checkout -b feature/nama-feature`
3. Commit changes: `git commit -m 'Add nama feature'`
4. Push ke branch: `git push origin feature/nama-feature`
5. Buat Pull Request

## 📄 License

This project is licensed under the MIT License.


# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

---
<div align="center">
  
  **⭐ Jika project ini membantu, jangan lupa kasih star ya! ⭐**
  
  Made with ❤️ by Firenze Higa
  
</div>
