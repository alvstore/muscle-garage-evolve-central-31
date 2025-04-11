
import React, { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

/**
 * Creates an icon element with standard styling for navigation
 * @param IconComponent - The Lucide icon component to use
 * @returns A React node with the icon properly styled
 */
export const createNavIcon = (IconComponent: LucideIcon): ReactNode => {
  return React.createElement(IconComponent, { className: "h-5 w-5" });
};
