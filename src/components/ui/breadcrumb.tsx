
import * as React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Define types
export interface BreadcrumbProps extends React.ComponentProps<"nav"> {
  children: React.ReactNode;
  separator?: React.ReactNode;
}

export interface BreadcrumbItemProps extends React.ComponentProps<"li"> {
  children: React.ReactNode;
}

export interface BreadcrumbLinkProps {
  asChild?: boolean;
  children: React.ReactNode;
  href?: string;
  className?: string;
  isCurrentPage?: boolean;
}

// Breadcrumb component
export function Breadcrumb({
  children,
  className,
  separator = <ChevronRight className="h-4 w-4" />,
  ...props
}: BreadcrumbProps) {
  const childrenArray = React.Children.toArray(children);
  const childrenWithSeparators = childrenArray.reduce(
    (acc: React.ReactNode[], child, index) => {
      if (index !== 0) {
        acc.push(
          <li key={`separator-${index}`} aria-hidden="true" className="mx-2 text-muted-foreground">
            {separator}
          </li>
        );
      }
      acc.push(child);
      return acc;
    },
    []
  );

  return (
    <nav
      className={cn("flex flex-wrap", className)}
      aria-label="Breadcrumb"
      {...props}
    >
      <ol className="flex items-center flex-wrap">{childrenWithSeparators}</ol>
    </nav>
  );
}

// BreadcrumbItem component
export function BreadcrumbItem({
  children,
  className,
  ...props
}: BreadcrumbItemProps) {
  return (
    <li className={cn("inline-flex items-center", className)} {...props}>
      {children}
    </li>
  );
}

// BreadcrumbLink component - using React Router's Link
export function BreadcrumbLink({
  children,
  href,
  className,
  isCurrentPage,
  ...props
}: BreadcrumbLinkProps) {
  if (isCurrentPage) {
    return (
      <span
        className={cn("text-muted-foreground font-medium", className)}
        aria-current="page"
        {...props}
      >
        {children}
      </span>
    );
  }

  return href ? (
    <Link
      to={href}
      className={cn("text-muted-foreground hover:text-foreground", className)}
      {...props}
    >
      {children}
    </Link>
  ) : (
    <span className={cn("text-muted-foreground", className)} {...props}>
      {children}
    </span>
  );
}

// Here we update the default exports for the Breadcrumb component
Breadcrumb.Item = BreadcrumbItem;
Breadcrumb.Link = BreadcrumbLink;

export { Breadcrumb as Breadcrumb2 };
