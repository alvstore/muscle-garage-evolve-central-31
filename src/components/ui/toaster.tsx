
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toast } = useToast()
  const [toasts, setToasts] = useState<any[]>([])
  
  // For compatibility with the sonner toast
  useEffect(() => {
    const unsubscribe = toast.onChange((toastData: any) => {
      if (toastData.type === 'add') {
        setToasts(prev => [...prev, toastData.toast])
      } else if (toastData.type === 'remove') {
        setToasts(prev => prev.filter(t => t.id !== toastData.toast.id))
      } else if (toastData.type === 'clear') {
        setToasts([])
      }
    })
    
    return () => unsubscribe()
  }, [toast])

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
