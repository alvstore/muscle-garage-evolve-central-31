
import { toast as sonnerToast } from "sonner";

type ToastMessage = string;

type ToastOptions = {
  title?: string;
  description?: string;
  duration?: number;
  action?: React.ReactNode;
};

type ToastProps = ToastMessage | ToastOptions;

function isToastOptions(props: ToastProps): props is ToastOptions {
  return typeof props === 'object' && props !== null;
}

export const useToast = () => {
  const toast = {
    success: (props: ToastProps) => {
      if (isToastOptions(props)) {
        return sonnerToast.success(props.title || "", {
          description: props.description,
          duration: props.duration,
          action: props.action,
        });
      } else {
        return sonnerToast.success(props);
      }
    },
    error: (props: ToastProps) => {
      if (isToastOptions(props)) {
        return sonnerToast.error(props.title || "", {
          description: props.description,
          duration: props.duration,
          action: props.action,
        });
      } else {
        return sonnerToast.error(props);
      }
    },
    warning: (props: ToastProps) => {
      if (isToastOptions(props)) {
        return sonnerToast.warning(props.title || "", {
          description: props.description,
          duration: props.duration,
          action: props.action,
        });
      } else {
        return sonnerToast.warning(props);
      }
    },
    info: (props: ToastProps) => {
      if (isToastOptions(props)) {
        return sonnerToast.info(props.title || "", {
          description: props.description,
          duration: props.duration,
          action: props.action,
        });
      } else {
        return sonnerToast.info(props);
      }
    }
  };

  return { toast };
};

// Export toast directly for convenience
export const toast = {
  success: (props: ToastProps) => {
    if (isToastOptions(props)) {
      return sonnerToast.success(props.title || "", {
        description: props.description,
        duration: props.duration,
        action: props.action,
      });
    } else {
      return sonnerToast.success(props);
    }
  },
  error: (props: ToastProps) => {
    if (isToastOptions(props)) {
      return sonnerToast.error(props.title || "", {
        description: props.description,
        duration: props.duration,
        action: props.action,
      });
    } else {
      return sonnerToast.error(props);
    }
  },
  warning: (props: ToastProps) => {
    if (isToastOptions(props)) {
      return sonnerToast.warning(props.title || "", {
        description: props.description,
        duration: props.duration,
        action: props.action,
      });
    } else {
      return sonnerToast.warning(props);
    }
  },
  info: (props: ToastProps) => {
    if (isToastOptions(props)) {
      return sonnerToast.info(props.title || "", {
        description: props.description,
        duration: props.duration,
        action: props.action,
      });
    } else {
      return sonnerToast.info(props);
    }
  }
};
