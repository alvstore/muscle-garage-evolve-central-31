
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

export interface BreadcrumbListProps extends React.ComponentProps<"ol"> {
  children: React.ReactNode;
}

export interface BreadcrumbSeparatorProps extends React.ComponentProps<"li"> {
  children?: React.ReactNode;
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
  // Filter out any data-* attributes from props
  const safeProps = Object.entries(props).reduce((acc, [key, value]) => {
    if (!key.startsWith('data-')) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);

  if (isCurrentPage) {
    return (
      <span
        className={cn("text-muted-foreground font-medium", className)}
        aria-current="page"
        {...safeProps}
      >
        {children}
      </span>
    );
  }

  return href ? (
    <Link
      to={href}
      className={cn("text-muted-foreground hover:text-foreground", className)}
      {...safeProps}
    >
      {children}
    </Link>
  ) : (
    <span className={cn("text-muted-foreground", className)} {...safeProps}>
      {children}
    </span>
  );
}

// BreadcrumbList component
export function BreadcrumbList({
  children,
  className,
  ...props
}: BreadcrumbListProps) {
  return (
    <ol
      className={cn("flex items-center space-x-2", className)}
      {...props}
    >
      {children}
    </ol>
  );
}

// BreadcrumbSeparator component
export function BreadcrumbSeparator({
  children,
  className,
  ...props
}: BreadcrumbSeparatorProps) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn("mx-2 text-muted-foreground", className)}
      {...props}
    >
      {children || <ChevronRight className="h-4 w-4" />}
    </li>
  );
}

// Add these exports to make the components available
export { Breadcrumb as Breadcrumb2 };
