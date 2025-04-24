
import { MessageSquare } from "lucide-react";

const FloatingWhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/+911234567890", "_blank");
  };

  return (
    <button 
      onClick={handleWhatsAppClick}
      className="fixed right-6 bottom-6 md:right-8 md:bottom-8 z-40 bg-green-500 hover:bg-green-600 rounded-full p-3 shadow-lg transition-transform duration-300 hover:scale-110"
      aria-label="Contact us on WhatsApp"
    >
      <MessageSquare className="h-6 w-6 text-white" />
    </button>
  );
};

export default FloatingWhatsAppButton;
