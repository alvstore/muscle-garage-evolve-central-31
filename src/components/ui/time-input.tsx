
import * as React from "react";
import { cn } from "@/lib/utils";

export interface TimeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  containerClassName?: string;
}

const TimeInput = React.forwardRef<HTMLInputElement, TimeInputProps>(
  ({ className, error, containerClassName, ...props }, ref) => {
    return (
      <div className={cn("relative", containerClassName)}>
        <input
          type="time"
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

TimeInput.displayName = "TimeInput";

export { TimeInput };
