# Volunteer Hub - API Integration Setup

## 🚀 Setup yang Telah Ditambahkan

### 1. Header Improvements
- ✅ Menghapus kolom search dari header
- ✅ Menu navigasi tetap di tengah header
- ✅ Layout yang lebih clean dan responsive

### 2. Page Transitions
- ✅ Menambahkan class `page-transition` untuk setiap halaman
- ✅ Animasi smooth saat pindah halaman
- ✅ CSS animation di `index.css`

### 3. TanStack React Query Setup
- ✅ Install `@tanstack/react-query` dan `@tanstack/react-query-devtools`
- ✅ Setup QueryClient di `main.jsx`
- ✅ DevTools untuk development

### 4. Axios API Setup
- ✅ Install `axios`
- ✅ Setup API client di `src/api/api.js`
- ✅ Request/Response interceptors
- ✅ Automatic token handling

### 5. Custom Hooks
- ✅ React Query hooks di `src/hooks/useQueries.js`
- ✅ Query keys untuk caching
- ✅ Mutations untuk create/update operations

## 📁 File Structure Baru

```
src/
├── api/
│   └── api.js                 # Axios setup & endpoints
├── hooks/
│   ├── useQueries.js         # React Query hooks
│   └── useMockData.js        # (existing)
├── examples/
│   └── EventsPageWithReactQuery.jsx  # Contoh implementasi
└── ...
```

## 🔧 Cara Menggunakan

### 1. Setup API Base URL
Edit `src/api/api.js`:
```javascript
const BASE_URL = 'http://localhost:8000/api'; // Ganti dengan URL API Anda
```

### 2. Menggunakan React Query di Component
```jsx
import { useEvents, useCategories } from '../hooks/useQueries';

const MyComponent = () => {
  const { data: events, isLoading, error } = useEvents();
  const { data: categories } = useCategories();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div className="page-transition">
      {/* Your content */}
    </div>
  );
};
```

### 3. Menggunakan Mutations
```jsx
import { useJoinEvent } from '../hooks/useQueries';

const EventCard = ({ event }) => {
  const joinMutation = useJoinEvent();
  
  const handleJoin = async () => {
    try {
      await joinMutation.mutateAsync({
        eventId: event.id,
        userData: { notes: "Excited to join!" }
      });
      // Success handling
    } catch (error) {
      // Error handling
    }
  };
  
  return (
    <button 
      onClick={handleJoin}
      disabled={joinMutation.isLoading}
    >
      {joinMutation.isLoading ? 'Joining...' : 'Join Event'}
    </button>
  );
};
```

## 🎯 Next Steps

1. **Replace Mock Data**: Ganti `useMockData` dengan React Query hooks
2. **Setup Backend**: Pastikan API endpoints sesuai dengan yang ada di `api.js`
3. **Authentication**: Implement login/register dengan React Query
4. **Error Handling**: Tambah toast notifications untuk feedback
5. **Loading States**: Tambah skeleton components yang lebih detail

## 🛠️ Available API Endpoints

- **Events**: GET, POST, PUT, DELETE `/api/events`
- **Organizations**: GET, POST, PUT, DELETE `/api/organizations`
- **Categories**: GET `/api/categories`
- **Auth**: POST `/api/auth/login`, `/api/auth/register`
- **Users**: GET, PUT `/api/users/profile`

## 📱 Features Ready

- ✅ Responsive design
- ✅ Page transitions
- ✅ Clean header layout
- ✅ API caching dengan React Query
- ✅ Automatic token management
- ✅ Error handling
- ✅ Loading states
- ✅ DevTools untuk debugging

Sekarang Anda siap untuk mengintegrasikan dengan backend API! 🎉