
import { useToast } from "@/hooks/ui/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <>
      <SonnerToaster 
        position="top-right" 
        closeButton 
        theme="light" 
        className="toaster"
      />
    </>
  );
}
