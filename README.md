# Volunteer Frontend Application

Frontend aplikasi volunteer management system menggunakan React 18 + Vite.

## 🔗 Related Repositories

- **Backend API**: [humanify-backend](https://github.com/firenzehiga/humanify-backend) - REST API server untuk volunteer activity manager

> **Note**: Aplikasi ini adalah bagian dari ekosistem Humanify - platform volunteer management yang terdiri dari web frontend, dan backend API.


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
├── api/                 # API calls dan service functions
├── assets/              # Static assets (images, icons)
├── components/          # Reusable React components
│   ├── admin/           # Admin-specific components
│   ├── layout/          # Layout components (Header, Footer)
│   └── ui/              # UI components (Button, Modal, etc.)
├── hooks/               # Custom React hooks
├── mock/                # Mock data untuk development
├── pages/               # Page components
├── store/               # State management (Zustand/Redux)
├── utils/               # Utility functions
├── App.jsx              # Main App component
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

## 📋 Available Features

### ✅ Completed Features
- [x] Event browsing dan search
- [x] Event detail view dengan modal
- [x] Location picker dengan Google Maps integration
- [x] Responsive UI dengan Tailwind CSS
- [x] Mock data untuk development
- [x] Component library (Button, Card, Modal, dll)

### 🔄 In Progress Features
- [ ] User authentication sistem
- [ ] Event registration flow
- [ ] Organization dashboard
- [ ] User profile management

### 📋 Planned Features
- [ ] Push notifications
- [ ] Event feedback sistem
- [ ] Admin panel
- [ ] Analytics dashboard
- [ ] Mobile app support

## 🎨 UI Components

Aplikasi menggunakan custom UI components yang dibangun dengan:
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Headless UI** - Unstyled, accessible UI components
- **React Hook Form** - Form handling
- **React Query** - Server state management

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

## 🌐 API Integration

Backend API saat ini masih dalam tahap setup. Mock data tersedia di folder `/src/mock/` untuk development:

- `events.json` - Data event volunteer
- `organizations.json` - Data organisasi
- `users.json` - Data users
- `categories.json` - Kategori event
- `saved_locations.json` - Lokasi tersimpan

## 📱 Browser Support

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

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

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
