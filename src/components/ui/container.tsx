
import * as React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: "default" | "sm" | "md" | "lg" | "xl" | "full";
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, className, size = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full",
          {
            "max-w-7xl px-4 sm:px-6 lg:px-8": size === "default",
            "max-w-5xl px-4 sm:px-6 lg:px-8": size === "sm",
            "max-w-6xl px-4 sm:px-6 lg:px-8": size === "md",
            "max-w-[90rem] px-4 sm:px-6 lg:px-8": size === "xl",
            "w-full": size === "full",
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";
