
import { ReactNode } from 'react';
import { toast as sonnerToast, Toast } from 'sonner';

// Enhanced toast type that includes common variant methods
interface EnhancedToast {
  (props: Omit<Toast, "id">): { 
    id: string;
    title?: ReactNode;
    description?: ReactNode; 
    action?: ReactNode;
    variant?: "default" | "destructive";
  };
  success: (props: {
    title: string;
    description?: string;
    action?: ReactNode;
  }) => void;
  error: (props: {
    title: string;
    description?: string;
    action?: ReactNode;
  }) => void;
  warning: (props: {
    title: string;
    description?: string;
    action?: ReactNode;
  }) => void;
  info: (props: {
    title: string;
    description?: string;
    action?: ReactNode;
  }) => void;
  promise: typeof sonnerToast.promise;
  dismiss: typeof sonnerToast.dismiss;
  custom: typeof sonnerToast.custom;
}

// Create enhanced toast with variant methods
const toast = sonnerToast as unknown as EnhancedToast;

// Add variant methods to the toast function
toast.success = ({ title, description, action }) => {
  sonnerToast(title, {
    description,
    action,
    className: 'bg-green-50 border-green-200 text-green-800',
  });
};

toast.error = ({ title, description, action }) => {
  sonnerToast(title, {
    description,
    action,
    className: 'bg-red-50 border-red-200 text-red-800',
  });
};

toast.warning = ({ title, description, action }) => {
  sonnerToast(title, {
    description,
    action,
    className: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  });
};

toast.info = ({ title, description, action }) => {
  sonnerToast(title, {
    description,
    action,
    className: 'bg-blue-50 border-blue-200 text-blue-800',
  });
};

// Re-export other toast methods
toast.promise = sonnerToast.promise;
toast.dismiss = sonnerToast.dismiss;
toast.custom = sonnerToast.custom;

// Create a hook for composable usage
const useToast = () => {
  return { toast };
};

export { useToast, toast };
