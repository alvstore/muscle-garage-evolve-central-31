
import { toast as sonnerToast } from "sonner";

type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

const useToast = () => {
  const toast = (props: ToastProps) => {
    sonnerToast(props.title, {
      description: props.description,
      action: props.action,
      className: props.variant === "destructive" ? "bg-destructive text-destructive-foreground" : ""
    });
  };

  return {
    toast
  };
};

// For direct usage
const toast = sonnerToast;

export { useToast, toast };
