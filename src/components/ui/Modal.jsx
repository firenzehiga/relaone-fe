import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
  className,
}) => {
  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  const MotionDiv = motion.div;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-start sm:items-center justify-center p-2 sm:p-4">
            {/* Backdrop */}
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <MotionDiv
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={cn(
                "relative w-full max-h-[90vh] overflow-y-auto bg-white border border-gray-200 rounded-2xl shadow-2xl my-4 sm:my-8",
                sizes[size],
                className
              )}
            >
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}

              {/* Content */}
              <div className={title ? "p-4 sm:p-6" : "p-4 sm:p-6"}>
                {children}
              </div>
            </MotionDiv>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
