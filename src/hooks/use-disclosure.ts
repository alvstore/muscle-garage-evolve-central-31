
import { useState, useCallback } from "react";

export interface UseDisclosureProps {
  defaultIsOpen?: boolean;
  onClose?(): void;
  onOpen?(): void;
}

export interface UseDisclosureReturn {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onToggle: () => void;
  onOpenChange: (open: boolean) => void; // Added this property
}

export function useDisclosure(props: UseDisclosureProps = {}): UseDisclosureReturn {
  const { defaultIsOpen = false, onClose: onCloseProp, onOpen: onOpenProp } = props;
  const [isOpen, setIsOpen] = useState(defaultIsOpen);

  const onClose = useCallback(() => {
    setIsOpen(false);
    onCloseProp?.();
  }, [onCloseProp]);

  const onOpen = useCallback(() => {
    setIsOpen(true);
    onOpenProp?.();
  }, [onOpenProp]);

  const onToggle = useCallback(() => {
    const action = isOpen ? onClose : onOpen;
    action();
  }, [isOpen, onClose, onOpen]);

  // Add onOpenChange for DialogProps compatibility
  const onOpenChange = useCallback((open: boolean) => {
    if (open) {
      onOpen();
    } else {
      onClose();
    }
  }, [onOpen, onClose]);

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
    onOpenChange
  };
}

export default useDisclosure;
