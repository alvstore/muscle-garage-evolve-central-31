import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <div className="flex items-center">
    <SwitchPrimitives.Root
      className={cn(
        "peer relative inline-flex h-[22px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500 data-[state=unchecked]:bg-slate-200 data-[state=unchecked]:border-slate-300 dark:data-[state=unchecked]:bg-slate-700 dark:data-[state=unchecked]:border-slate-600",
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block h-[16px] w-[16px] rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.2)] ring-0 transition-transform duration-200 will-change-transform data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-[2px] data-[state=checked]:shadow-[0_2px_4px_rgba(115,103,240,0.4)]"
        )}
      />
    </SwitchPrimitives.Root>
  </div>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
