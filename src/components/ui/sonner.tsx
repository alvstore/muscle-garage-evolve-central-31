
import { useTheme } from "next-themes"
import { Toaster as Sonner, toast as sonnerToast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

// Safe toast wrapper that ensures we don't pass objects directly to toast
export const toast = {
  // Standard toast variants
  success: (message: string | { title: string; description?: string }) => {
    if (typeof message === 'string') {
      return sonnerToast.success(message);
    } else {
      return sonnerToast.success(message.title, {
        description: message.description
      });
    }
  },
  
  error: (message: string | { title: string; description?: string }) => {
    if (typeof message === 'string') {
      return sonnerToast.error(message);
    } else {
      return sonnerToast.error(message.title, {
        description: message.description
      });
    }
  },
  
  info: (message: string | { title: string; description?: string }) => {
    if (typeof message === 'string') {
      return sonnerToast.info(message);
    } else {
      return sonnerToast.info(message.title, {
        description: message.description
      });
    }
  },
  
  warning: (message: string | { title: string; description?: string }) => {
    if (typeof message === 'string') {
      return sonnerToast.warning(message);
    } else {
      return sonnerToast.warning(message.title, {
        description: message.description
      });
    }
  },
  
  // Custom toast with options
  custom: (options: any) => {
    if (typeof options === 'object' && options.title) {
      const { title, ...rest } = options;
      return sonnerToast(title, rest);
    } else {
      console.warn('Invalid toast options:', options);
      return sonnerToast('Notification', { description: 'No details available' });
    }
  }
};

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
