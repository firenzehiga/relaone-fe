import { create } from "zustand";

// Store untuk autentikasi
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

// Store untuk UI states
export const useUIStore = create((set) => ({
  loading: false,
  darkMode: true,
  sidebarOpen: false,
  setLoading: (loading) => set({ loading }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

// Store untuk events
export const useEventStore = create((set, get) => ({
  events: [],
  filteredEvents: [],
  selectedEvent: null,
  filters: {
    category: "",
    search: "",
    date: "",
    status: "published",
  },
  setEvents: (events) => set({ events, filteredEvents: events }),
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  setFilters: (filters) => {
    set({ filters });
    // Apply filters
    const { events } = get();
    let filtered = events;

    if (filters.category) {
      filtered = filtered.filter(
        (event) => event.category_id === parseInt(filters.category)
      );
    }

    if (filters.search) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          event.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter((event) => event.status === filters.status);
    }

    set({ filteredEvents: filtered });
  },
}));

// Store untuk modal dan popups
export const useModalStore = create((set) => ({
  isJoinModalOpen: false,
  isLoginModalOpen: false,
  isRegisterModalOpen: false,
  selectedEventId: null,
  openJoinModal: (eventId) =>
    set({ isJoinModalOpen: true, selectedEventId: eventId }),
  closeJoinModal: () => set({ isJoinModalOpen: false, selectedEventId: null }),
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
  openRegisterModal: () => set({ isRegisterModalOpen: true }),
  closeRegisterModal: () => set({ isRegisterModalOpen: false }),
}));
