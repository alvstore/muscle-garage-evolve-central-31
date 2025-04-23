
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const Breadcrumb = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className
    )}
    {...props}
  />
))
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.OlHTMLAttributes<HTMLOListElement>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words sm:gap-2.5",
      className
    )}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

// Fix to avoid using React.AnchorElement which doesn't exist
const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    isCurrentPage?: boolean
  }
>(({ className, href, isCurrentPage = false, ...props }, ref) => {
  if (isCurrentPage) {
    return (
      <span
        className={cn(
          "flex items-center font-medium text-foreground",
          className
        )}
        aria-current="page"
        {...props}
      />
    )
  }

  return (
    <a
      ref={ref}
      href={href}
      className={cn(
        "flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
        className
      )}
      {...props}
    />
  )
})
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbSeparator = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="presentation"
    className={cn("text-muted-foreground", className)}
    {...props}
  />
))
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const BreadcrumbEllipsis = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="presentation"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <span className="h-1 w-1 rounded-full bg-muted-foreground" />
    <span className="mx-0.5 h-1 w-1 rounded-full bg-muted-foreground" />
    <span className="h-1 w-1 rounded-full bg-muted-foreground" />
    <span className="sr-only">More</span>
  </span>
))
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
