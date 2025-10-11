import { create } from "zustand";

/**
 * Store untuk manajemen autentikasi user
 * Menyimpan informasi user yang sedang login dan status authentication
 */
export const useAuthStore = create((set) => ({
	/** @type {Object|null} Data user yang sedang login */
	user: null,
	/** @type {boolean} Status apakah user sudah authenticated */
	isAuthenticated: false,

	/**
	 * Login user dan simpan data user
	 * @param {Object} userData - Data user yang akan disimpan
	 */
	login: (userData) => set({ user: userData, isAuthenticated: true }),

	/**
	 * Logout user dan hapus semua data user
	 */
	logout: () => set({ user: null, isAuthenticated: false }),
}));

/**
 * Store untuk manajemen UI states global
 * Mengatur state seperti loading, dark mode, sidebar, dll
 */
export const useUIStore = create((set) => ({
	/** @type {boolean} Status loading global */
	loading: false,
	/** @type {boolean} Status dark mode */
	darkMode: true,
	/** @type {boolean} Status sidebar terbuka/tertutup */
	sidebarOpen: false,

	/**
	 * Set status loading global
	 * @param {boolean} loading - Status loading baru
	 */
	setLoading: (loading) => set({ loading }),

	/**
	 * Toggle dark mode on/off
	 */
	toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

	/**
	 * Set status sidebar terbuka/tertutup
	 * @param {boolean} open - Status sidebar baru
	 */
	setSidebarOpen: (open) => set({ sidebarOpen: open }),

	/**
	 * Toggle sidebar terbuka/tertutup
	 */
	toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

/**
 * Store untuk manajemen events dan filtering
 * Menyimpan daftar events, event yang dipilih, dan filter yang diterapkan
 */
export const useEventStore = create((set, get) => ({
	/** @type {Array} Daftar semua events */
	events: [],
	/** @type {Array} Daftar events yang sudah difilter */
	filteredEvents: [],
	/** @type {Object|null} Event yang sedang dipilih */
	selectedEvent: null,
	/** @type {Object} Filter yang sedang diterapkan */
	filters: {
		category: "",
		search: "",
		date: "",
		status: "published",
	},

	/**
	 * Set daftar events dan reset filtered events
	 * @param {Array} events - Daftar events baru
	 */
	setEvents: (events) => set({ events, filteredEvents: events }),

	/**
	 * Set event yang sedang dipilih
	 * @param {Object} event - Event yang dipilih
	 */
	setSelectedEvent: (event) => set({ selectedEvent: event }),

	/**
	 * Set filter dan apply filtering secara otomatis
	 * @param {Object} filters - Filter baru yang akan diterapkan
	 */
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

/**
 * Store untuk manajemen modal dan popup dialogs
 * Mengatur state buka/tutup modal dan data yang terkait
 */
export const useModalStore = create((set) => ({
	/** @type {boolean} Status modal join event terbuka/tertutup */
	isJoinModalOpen: false,
	/** @type {boolean} Status modal login terbuka/tertutup */
	isLoginModalOpen: false,
	/** @type {boolean} Status modal register terbuka/tertutup */
	isRegisterModalOpen: false,
	/** @type {string|number|null} ID event yang dipilih untuk di-join */
	selectedEventId: null,

	/**
	 * Buka modal join event dengan event ID tertentu
	 * @param {string|number} eventId - ID event yang akan di-join
	 */
	openJoinModal: (eventId) =>
		set({ isJoinModalOpen: true, selectedEventId: eventId }),

	/**
	 * Tutup modal join event dan reset selected event ID
	 */
	closeJoinModal: () => set({ isJoinModalOpen: false, selectedEventId: null }),

	/**
	 * Buka modal login
	 */
	openLoginModal: () => set({ isLoginModalOpen: true }),

	/**
	 * Tutup modal login
	 */
	closeLoginModal: () => set({ isLoginModalOpen: false }),

	/**
	 * Buka modal register
	 */
	openRegisterModal: () => set({ isRegisterModalOpen: true }),

	/**
	 * Tutup modal register
	 */
	closeRegisterModal: () => set({ isRegisterModalOpen: false }),
}));
