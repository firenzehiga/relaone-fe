import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";
import Button from "./ui/Button";
import Badge from "./ui/Badge";
import Avatar from "./ui/Avatar";
import { cn } from "./../utils/cn";

const EventCard = ({
  event,
  onJoin,
  onViewDetail,
  className,
  showOrganizer = true,
}) => {
  if (!event) return null;

  const MotionDiv = motion.div;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return timeString.slice(0, 5);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { variant: "success", text: "Terbuka" },
      draft: { variant: "warning", text: "Draft" },
      cancelled: { variant: "danger", text: "Dibatalkan" },
      full: { variant: "secondary", text: "Penuh" },
    };

    return statusConfig[status] || statusConfig.published;
  };

  const getCategoryColor = (categoryId) => {
    const colors = {
      1: "success", // Environment
      2: "primary", // Education
      3: "danger", // Health
      4: "secondary", // Social
      5: "warning", // Youth
      6: "primary", // Technology
    };
    return colors[categoryId] || "default";
  };

  const statusBadge = getStatusBadge(event.status);
  const slotsRemaining = event.capacity - event.registered;

  return (
    <MotionDiv
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:shadow-blue-500/10",
        className
      )}
    >
      {/* Event Banner */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.banner}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge variant={statusBadge.variant}>{statusBadge.text}</Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant={getCategoryColor(event.category_id)}>
            {event.category?.name || "Kategori"}
          </Badge>
        </div>
      </div>

      {/* Event Content */}
      <div className="p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 leading-tight">
          {event.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-700 text-sm">
            <Calendar size={16} className="mr-3 text-blue-600 flex-shrink-0" />
            <span className="font-semibold">
              {formatDate(event.date)} • {formatTime(event.time)} -{" "}
              {formatTime(event.end_time)}
            </span>
          </div>

          <div className="flex items-center text-gray-700 text-sm">
            <MapPin size={16} className="mr-3 text-purple-600 flex-shrink-0" />
            <span className="line-clamp-1 font-semibold">{event.location}</span>
          </div>

          <div className="flex items-center text-gray-700 text-sm">
            <Users size={16} className="mr-3 text-green-600 flex-shrink-0" />
            <span className="font-semibold">
              {event.registered} / {event.capacity} peserta
            </span>
            {slotsRemaining > 0 && (
              <span className="text-green-700 ml-2 font-bold text-xs bg-green-50 px-2 py-1 rounded-full">
                {slotsRemaining} slot tersisa
              </span>
            )}
          </div>
        </div>

        {/* Organizer */}
        {showOrganizer && event.organizer && (
          <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
            <Avatar
              src={event.organizer.avatar}
              fallback={event.organizer.name}
              size="sm"
            />
            <span className="text-gray-700 text-sm ml-3 font-semibold">
              oleh {event.organizer.name}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetail?.(event.id)}
          >
            Detail
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            disabled={event.status === "full" || event.status === "cancelled"}
            onClick={() => onJoin?.(event.id)}
          >
            {event.status === "full" ? "Penuh" : "Daftar"}
          </Button>
        </div>
      </div>
    </MotionDiv>
  );
};

export default EventCard;
