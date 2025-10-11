# Volunteer Hub - API Integration dengan Axios + TanStack Query

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

### 4. Simple API System 
- ✅ **Axios + TanStack Query dengan mock data**
- ✅ **Structure yang sama dengan real API**
- ✅ **Easy migration ke backend nanti**
- ✅ Automatic caching & invalidation

### 5. Updated Components
- ✅ `EventsPage.jsx` - Menggunakan axios + React Query
- ✅ `JoinEventModal.jsx` - Menggunakan mutations
- ✅ Comprehensive JSDoc documentation
- ✅ Hapus cara lama (useMockData hooks)

## 📁 File Structure

```
src/
├── api/
│   ├── api.js                 # Original axios setup (unused)
│   └── mockApi.js            # 🆕 Axios + mock data untuk development
├── hooks/
│   ├── useQueries.js         # TanStack Query hooks
│   └── useMockData.js        # ❌ Legacy (akan dihapus)
├── pages/
│   └── EventsPage.jsx        # ✅ Updated dengan React Query
├── components/
│   └── JoinEventModal.jsx    # ✅ Updated dengan mutations
└── ...
```

## 🔧 Cara Kerja System Sekarang

### Development Mode (Sekarang)
```javascript
// File: src/api/mockApi.js
// Sementara pakai mock data dengan structure real API

export const endpoints = {
  events: {
    getAll: (params) => {
      // TODO: Nanti ganti jadi real API call
      return mockApiResponse(eventsData);
    }
  }
}
```

### Production Mode (Nanti pas backend ready)
```javascript
// Tinggal ganti isi function jadi real API calls:

export const endpoints = {
  events: {
    getAll: (params) => {
      return api.get("/events", { params }); // Real API call
    }
  }
}
```

### 4. Menggunakan React Query (Same interface)
```jsx
import { useEvents, useCategories, useJoinEvent } from '../hooks/useQueries';

const MyComponent = () => {
  // Sekarang pakai mock, nanti otomatis real API
  const { data: events, isLoading, error } = useEvents();
  const { data: categories } = useCategories();
  
  // Mutation sekarang mock, nanti real API
  const joinMutation = useJoinEvent();
  
  const handleJoin = async (eventId) => {
    try {
      await joinMutation.mutateAsync({
        eventId,
        userData: { notes: "Excited to join!" }
      });
      // Success handling
    } catch (error) {
      // Error handling
    }
  };
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div className="page-transition">
      {/* Your content */}
    </div>
  );
};
```

## 🎯 Migration Plan ke Real API

### Step 1: Backend Ready
Ketika backend sudah ready, tinggal:

### Step 2: Update mockApi.js
```javascript
// Di src/api/mockApi.js
// Ganti semua TODO dari:
getAll: (params) => mockApiResponse(eventsData)

// Jadi:
getAll: (params) => api.get("/events", { params })
```

### Step 3: Test & Deploy
- ✅ Interface tetap sama
- ✅ Components tidak berubah
- ✅ Hooks tetap sama
- ✅ Caching otomatis jalan

## 🎉 Benefits Simple Approach

### For Development:
- 🚀 **Fast & simple** - langsung pakai TanStack Query
- 📝 **Same interface** dengan real API nanti
- 🎯 **No configuration** - no environment variables
- 🔧 **Easy debugging** - standard axios + React Query

### For Migration:
- 🛡️ **Seamless migration** - tinggal ganti function bodies
- ⚡ **Zero breaking changes** - interface tetap sama
- 🔄 **Gradual migration** - bisa ganti endpoint satu-satu
- 📊 **Production ready** - structure sudah benar

## 🎯 Next Steps

### Phase 1: Development (Current) ✅
- ✅ **Hybrid API system dengan mock fallback**
- ✅ **TanStack Query + Axios implementation**
- ✅ **Comprehensive JSDoc documentation**
- ✅ **Error handling dan loading states**

### Phase 2: Backend Integration 🔄
1. **Setup Backend API**: Buat endpoints sesuai dengan yang ada di `hybridApi.js`
2. **Update Environment**: Set `REACT_APP_USE_API=true`
3. **Test Integration**: API calls dengan fallback jika ada masalah
4. **Remove Mock Dependencies**: Setelah API stable

### Phase 3: Production 🚀
1. **Authentication Flow**: Implement login/register dengan tokens
2. **Error Boundaries**: Tambah global error handling
3. **Toast Notifications**: User feedback untuk actions
4. **Performance Optimization**: Optimize queries dan caching

## 🛠️ Available API Endpoints

Semua endpoints ini sekarang pakai mock data, tapi structure sama dengan real API:

### Events API
- **GET** `/api/events` - List events dengan filtering
- **GET** `/api/events/:id` - Detail event
- **POST** `/api/events` - Create event baru
- **PUT** `/api/events/:id` - Update event
- **DELETE** `/api/events/:id` - Delete event
- **POST** `/api/events/:id/join` - Join event sebagai volunteer

### Organizations API
- **GET** `/api/organizations` - List organizations
- **GET** `/api/organizations/:id` - Detail organization

### Categories API
- **GET** `/api/categories` - List semua categories
- **GET** `/api/categories/:id` - Detail category

### Authentication API
- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/register` - User registration
- **POST** `/api/auth/logout` - User logout

### Users API
- **GET** `/api/users/profile` - User profile
- **PUT** `/api/users/profile` - Update profile
- **GET** `/api/users/registrations` - User's event registrations

## 📱 Features Ready

- ✅ **Responsive design**
- ✅ **Page transitions**
- ✅ **Clean header layout**
- ✅ **Axios + TanStack Query integration**
- ✅ **Smart caching & invalidation**
- ✅ **Loading states & error handling**
- ✅ **DevTools untuk debugging**
- ✅ **Comprehensive JSDoc documentation**
- ✅ **Easy migration path ke real API**

Sekarang development jadi simple dan migration ke backend nanti tinggal ganti function bodies! 🎉