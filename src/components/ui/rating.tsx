
import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  count?: number;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  className?: string;
}

export function Rating({
  value,
  onChange,
  count = 5,
  size = "md",
  readonly = false,
  className,
}: RatingProps) {
  const starSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleClick = (index: number) => {
    if (!readonly && onChange) {
      onChange(index + 1);
    }
  };

  return (
    <div className={cn("flex items-center", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            starSizes[size],
            "cursor-pointer transition-all",
            index < value
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300",
            !readonly && "hover:text-yellow-400"
          )}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
}
