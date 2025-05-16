
import React from 'react';

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  variant?: 'default' | 'separated';
}

export const List = React.forwardRef<HTMLUListElement, ListProps>(({ className, variant = 'default', ...props }, ref) => {
  const baseClasses = "space-y-1";
  const variantClasses = variant === 'separated' ? "divide-y divide-border" : "";
  
  return <ul ref={ref} className={`${baseClasses} ${variantClasses} ${className || ''}`} {...props} />;
});

List.displayName = "List";

export interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {}

export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(({ className, ...props }, ref) => {
  return <li ref={ref} className={`py-2 ${className || ''}`} {...props} />;
});

ListItem.displayName = "ListItem";

// Fix the ListIcon type to be specifically for HTML span elements
export const ListIcon: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className, children, ...props }) => {
  return <span className={`mr-2 inline-block ${className || ''}`} {...props}>{children}</span>;
};
