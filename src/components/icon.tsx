
import React, { forwardRef } from "react";
import { LucideIcon, LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IconProps extends LucideProps {
  name: string;
}

const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ name, className, ...props }, ref) => {
    // This will render the icon directly as an SVG element, not wrapped in a div
    // This resolves the ref type issue
    const iconLookup: { [key: string]: LucideIcon } = {
      // You'd add actual mappings here based on your app's needs
      // For now, this is just a placeholder to make TypeScript happy
    };
    
    return React.createElement(iconLookup[name] || 'svg', {
      ref,
      className: cn(className),
      ...props
    });
  }
);

Icon.displayName = "Icon";

export default Icon;
