import { motion } from "framer-motion";
import { MapPin, Users, Calendar } from "lucide-react";
import { cn } from "../../utils/cn";

const OrganizationCard = ({ organization, onViewProfile, className }) => {
  if (!organization) return null;

  const MotionDiv = motion.div;

  return (
    <MotionDiv
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer",
        className
      )}
      onClick={() => onViewProfile?.(organization.id)}
    >
      {/* Organization Banner */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={organization.banner}
          alt={organization.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      {/* Organization Content */}
      <div className="p-4 relative">
        {/* Logo */}
        <div className="absolute -top-8 left-4">
          <img
            src={organization.logo}
            alt={organization.name}
            className="w-16 h-16 rounded-full border-4 border-gray-800 object-cover"
          />
        </div>

        {/* Content */}
        <div className="pt-10">
          <h3 className="font-semibold text-white text-lg mb-2 line-clamp-1">
            {organization.name}
          </h3>

          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
            {organization.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-gray-400 text-sm">
              <Calendar size={16} className="mr-2" />
              <span>{organization.total_events} event</span>
            </div>

            <div className="flex items-center text-gray-400 text-sm">
              <Users size={16} className="mr-2" />
              <span>{organization.total_volunteers} volunteer</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-400 text-sm">
            <MapPin size={16} className="mr-2" />
            <span className="line-clamp-1">{organization.address}</span>
          </div>
        </div>
      </div>
    </MotionDiv>
  );
};

export default OrganizationCard;
