
import React from 'react';
import { Star } from 'lucide-react';
import { cn } from "@/lib/utils";

interface RatingProps {
  count?: number;
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  ({ count = 5, value = 0, onChange, size = "md", disabled = false }, ref) => {
    const [hoverValue, setHoverValue] = React.useState<number | null>(null);

    const getSizeClass = () => {
      switch (size) {
        case "sm": return "h-4 w-4";
        case "lg": return "h-6 w-6";
        default: return "h-5 w-5";
      }
    };

    const handleMouseOver = (index: number) => {
      if (!disabled) {
        setHoverValue(index);
      }
    };

    const handleMouseLeave = () => {
      setHoverValue(null);
    };

    const handleClick = (index: number) => {
      if (!disabled && onChange) {
        onChange(index);
      }
    };

    const sizeClass = getSizeClass();

    return (
      <div 
        ref={ref}
        className="flex items-center" 
        onMouseLeave={handleMouseLeave}
      >
        {[...Array(count)].map((_, index) => {
          const ratingValue = index + 1;
          const isActive = (hoverValue || value) >= ratingValue;
          
          return (
            <div
              key={index}
              className={cn(
                "cursor-pointer mr-1",
                disabled && "cursor-default opacity-70"
              )}
              onMouseOver={() => handleMouseOver(ratingValue)}
              onClick={() => handleClick(ratingValue)}
            >
              <Star 
                className={cn(
                  sizeClass,
                  "transition-colors",
                  isActive ? "fill-yellow-400 text-yellow-400" : "fill-transparent text-gray-300"
                )}
              />
            </div>
          );
        })}
      </div>
    );
  }
);

Rating.displayName = 'Rating';
