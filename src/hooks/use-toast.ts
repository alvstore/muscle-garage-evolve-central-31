
import { toast as sonnerToast, ToastT } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

export const useToast = () => {
  const toast = {
    error: (message: string) => {
      sonnerToast.error(message);
    },
    success: (message: string) => {
      sonnerToast.success(message);
    },
    info: (message: string) => {
      sonnerToast(message);
    },
    // For backward compatibility with the object API
    toast: (props: ToastProps) => {
      if (props.variant === "destructive") {
        sonnerToast.error(props.title, {
          description: props.description,
          action: props.action
        });
      } else {
        sonnerToast(props.title, {
          description: props.description,
          action: props.action
        });
      }
    }
  };

  return toast;
};

// Export a compatible toast object for direct imports
export const toast = {
  error: (message: string) => {
    sonnerToast.error(message);
  },
  success: (message: string) => {
    sonnerToast.success(message);
  },
  info: (message: string) => {
    sonnerToast(message);
  },
  // Legacy/direct call support
  ...sonnerToast
};

