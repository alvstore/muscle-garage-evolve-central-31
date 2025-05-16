
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import * as TabsPrimitive from "@radix-ui/react-tabs";

interface LocalTabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {
  defaultValue: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

const LocalTabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  LocalTabsProps
>(({ defaultValue, onValueChange, className, children, ...props }, ref) => {
  const [value, setValue] = useState(defaultValue);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <TabsPrimitive.Root
      ref={ref}
      value={value}
      onValueChange={handleValueChange}
      className={className}
      {...props}
    >
      {children}
    </TabsPrimitive.Root>
  );
});
LocalTabs.displayName = "LocalTabs";

// Re-export the other components from Radix UI
const LocalTabsList = TabsPrimitive.List;
const LocalTabsTrigger = TabsPrimitive.Trigger;
const LocalTabsContent = TabsPrimitive.Content;

export { LocalTabs, LocalTabsList, LocalTabsTrigger, LocalTabsContent };
