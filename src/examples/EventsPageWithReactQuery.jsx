// Contoh implementasi di EventsPage.jsx dengan React Query
// Ganti import useMockData dengan useEvents, useCategories

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, Calendar, MapPin } from "lucide-react";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import EventCard from "../components/EventCard";
import Skeleton from "../components/ui/Skeleton";
import { useEvents, useCategories, useJoinEvent } from "../hooks/useQueries";
import { useModalStore } from "../store";

const EventsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { openJoinModal } = useModalStore();

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    status: "published",
    date: "",
  });

  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // React Query hooks
  const {
    data: events,
    isLoading: eventsLoading,
    error: eventsError,
  } = useEvents(filters);

  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const joinEventMutation = useJoinEvent();

  // Filter events when data or filters change
  useEffect(() => {
    if (!events) return;

    let filtered = events.filter((event) => event.status === filters.status);

    if (filters.search) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          event.description
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          event.location.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category) {
      const category = categories?.find(
        (cat) =>
          cat.name.toLowerCase() === filters.category.toLowerCase() ||
          cat.slug === filters.category.toLowerCase()
      );
      if (category) {
        filtered = filtered.filter(
          (event) => event.category_id === category.id
        );
      }
    }

    if (filters.date) {
      filtered = filtered.filter((event) => event.date === filters.date);
    }

    setFilteredEvents(filtered);
  }, [events, categories, filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Update URL params
    const newParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && k !== "status") {
        newParams.set(k, v);
      }
    });
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      status: "published",
      date: "",
    });
    setSearchParams({});
  };

  const handleJoinEvent = async (eventId) => {
    try {
      await joinEventMutation.mutateAsync({
        eventId,
        userData: {
          notes: "",
          agreed: true,
        },
      });

      // Handle success (could show toast notification)
      console.log("Successfully joined event");
    } catch (error) {
      // Handle error (could show error toast)
      console.error("Failed to join event:", error);
    }
  };

  const handleViewEventDetail = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  // Error handling
  if (eventsError) {
    return (
      <div className="min-h-screen py-8 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Error Loading Events
            </h3>
            <p className="text-gray-600 mb-6">
              {eventsError.message || "Something went wrong"}
            </p>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const MotionDiv = motion.div;

  return (
    <div className="page-transition">
      {/* Rest of your EventsPage JSX remains the same */}
      {/* Just replace eventsLoading with eventsLoading from React Query */}
      {/* Replace events with events from React Query */}
      {/* Replace categories with categories from React Query */}
    </div>
  );
};

export default EventsPage;
