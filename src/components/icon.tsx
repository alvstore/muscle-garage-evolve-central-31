
import React from "react";
import { LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IconProps extends LucideProps {
  name: string;
}

const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, className, ...props }, ref) => {
    return (
      <div className={cn("icon", className)} {...props} ref={ref}>
        {/* Icon content would go here based on the name prop */}
        {name}
      </div>
    );
  }
);

Icon.displayName = "Icon";

export default Icon;
