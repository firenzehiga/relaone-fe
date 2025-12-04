import { create } from "zustand";

/**
 * ========================================
 * AUTH STORE - Kelola Authentication User
 * ========================================
 * State: user data, authentication status, loading, error
 * Actions: login, logout, setLoading, setError
 */
export const useAuthStore = create((set) => ({
	// STATE
	user: null,
	isAuthenticated: false,
	isLoading: false,
	error: null,

	// ACTIONS
	login: (userData) =>
		set({
			user: userData,
			isAuthenticated: true,
			error: null,
		}),

	logout: () =>
		set({
			user: null,
			isAuthenticated: false,
			error: null,
		}),

	setLoading: (loading) => set({ isLoading: loading }),

	setError: (error) => set({ error }),

	clearError: () => set({ error: null }),
}));

/**
 * ========================================
 * EVENT STORE - Kelola Events & Filtering
 * ========================================
 * State: events list, filtered events, selected event, filters
 * Actions: setEvents, setSelectedEvent, setFilters, clearFilters
 */
export const useEventStore = create((set, get) => ({
	// STATE
	events: [],
	filteredEvents: [],
	selectedEvent: null,
	isLoading: false,
	error: null,
	filters: {
		category: "",
		search: "",
		date: "",
		status: "published",
	},

	// ACTIONS
	setEvents: (events) =>
		set({
			events,
			filteredEvents: events,
			error: null,
		}),

	setSelectedEvent: (event) => set({ selectedEvent: event }),

	setLoading: (loading) => set({ isLoading: loading }),

	setError: (error) => set({ error }),

	clearError: () => set({ error: null }),

	clearFilters: () => {
		const defaultFilters = {
			category: "",
			search: "",
			date: "",
			status: "published",
		};
		set({ filters: defaultFilters });

		// Reapply with default filters
		const { events } = get();
		set({ filteredEvents: events });
	},

	setFilters: (newFilters) => {
		// Merge dengan filter yang sudah ada
		const currentFilters = get().filters;
		const filters = { ...currentFilters, ...newFilters };
		set({ filters });

		// Apply filtering
		const { events } = get();
		let filtered = [...events]; // Create copy to avoid mutation

		// Filter by category
		if (filters.category) {
			filtered = filtered.filter((event) => event.category_id === parseInt(filters.category));
		}

		// Filter by search (title & description)
		if (filters.search) {
			const searchLower = filters.search.toLowerCase();
			filtered = filtered.filter(
				(event) =>
					event.title.toLowerCase().includes(searchLower) ||
					event.description.toLowerCase().includes(searchLower)
			);
		}

		// Filter by status
		if (filters.status) {
			filtered = filtered.filter((event) => event.status === filters.status);
		}

		// Filter by date (if needed in future)
		if (filters.date) {
			// TODO: Implement date filtering logic
		}

		set({ filteredEvents: filtered });
	},
}));

/**
 * ========================================
 * MODAL STORE - Kelola Modal & Popup Dialogs
 * ========================================
 * State: modal states, selected data
 * Actions: open/close modals
 */
export const useModalStore = create((set) => ({
	// STATE
	isJoinModalOpen: false,
	selectedEventId: null,
	selectedEventDetail: null,

	// Cancel Join modal state
	isCancelModalOpen: false,
	selectedCancelParticipant: null,

	// ACTIONS - Join Modal
	// accept optional full event object to avoid waiting for API fetch
	openJoinModal: (event = null) =>
		set({
			isJoinModalOpen: true,
			selectedEventDetail: event,
		}),

	closeJoinModal: () =>
		set({
			isJoinModalOpen: false,
			selectedEventDetail: null,
		}),

	// ACTIONS - Cancel Modal
	openCancelModal: (participant = null) =>
		set({
			isCancelModalOpen: true,
			selectedCancelParticipant: participant,
		}),

	closeCancelModal: () =>
		set({
			isCancelModalOpen: false,
			selectedCancelParticipant: null,
		}),

	// ACTIONS - Feedback Modal
	isFeedbackModalOpen: false,
	selectedFeedbackParticipant: null,
	openFeedbackModal: (participant = null) =>
		set({
			isFeedbackModalOpen: true,
			selectedFeedbackParticipant: participant,
		}),

	closeFeedbackModal: () =>
		set({
			isFeedbackModalOpen: false,
			selectedFeedbackParticipant: null,
		}),

	// ACTIONS - Onboarding Modal
	isOnboardingModalOpen: false,
	openOnboardingModal: () => set({ isOnboardingModalOpen: true }),
	closeOnboardingModal: () => set({ isOnboardingModalOpen: false }),

	// ACTIONS - Detail Modal
	// ACTIONS - Close All
	closeAllModals: () =>
		set({
			isJoinModalOpen: false,
			selectedEventId: null,
			selectedEventDetail: null,
			// cancel modal
			isCancelModalOpen: false,
			selectedCancelParticipant: null,
			// feedback modal
			isFeedbackModalOpen: false,
			selectedFeedbackParticipant: null,
			// onboarding modal
			isOnboardingModalOpen: false,
		}),
}));
