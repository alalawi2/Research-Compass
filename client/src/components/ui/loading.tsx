import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// Skeleton component for loading states
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "circular" | "text" | "card";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({
  className,
  variant = "default",
  width,
  height,
  lines = 1,
  ...props
}: SkeletonProps) {
  const baseStyles = "animate-pulse bg-muted";

  const variantStyles = {
    default: "rounded-md",
    circular: "rounded-full",
    text: "rounded h-4",
    card: "rounded-xl",
  };

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  if (variant === "text" && lines > 1) {
    return (
      <div className={cn("space-y-2", className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(baseStyles, variantStyles.text)}
            style={{
              width: i === lines - 1 ? "60%" : "100%",
              height: height || "1rem",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], className)}
      style={style}
      {...props}
    />
  );
}

// Spinner component
interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizeStyles = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <Loader2
      className={cn("animate-spin text-muted-foreground", sizeStyles[size], className)}
    />
  );
}

// Full page loader
interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = "Loading..." }: PageLoaderProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-muted animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner size="lg" className="text-primary" />
        </div>
      </div>
      <p className="text-muted-foreground animate-pulse">{message}</p>
    </div>
  );
}

// Inline loader for buttons/forms
interface InlineLoaderProps {
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function InlineLoader({ loading, children, className }: InlineLoaderProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {loading && <Spinner size="sm" />}
      {children}
    </span>
  );
}

// Card skeleton for dashboard cards
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border bg-card p-6 space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton width={60} height={20} />
      </div>
      <Skeleton variant="text" lines={2} />
      <Skeleton width="80%" height={8} className="rounded-full" />
    </div>
  );
}

// Table skeleton for data tables
interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="rounded-lg border overflow-hidden">
      {/* Header */}
      <div className="bg-muted/50 p-4 flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="flex-1" height={20} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4 flex gap-4 border-t">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="flex-1" height={16} />
          ))}
        </div>
      ))}
    </div>
  );
}

// Stats skeleton for metrics
export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card p-4 space-y-2">
          <Skeleton width={100} height={14} />
          <Skeleton width={80} height={32} />
          <Skeleton width={60} height={12} />
        </div>
      ))}
    </div>
  );
}

// List skeleton
interface ListSkeletonProps {
  items?: number;
  showAvatar?: boolean;
}

export function ListSkeleton({ items = 5, showAvatar = true }: ListSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
          {showAvatar && <Skeleton variant="circular" width={40} height={40} />}
          <div className="flex-1 space-y-2">
            <Skeleton width="60%" height={16} />
            <Skeleton width="40%" height={12} />
          </div>
          <Skeleton width={60} height={24} />
        </div>
      ))}
    </div>
  );
}

// Progress skeleton for workflows
export function WorkflowSkeleton() {
  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton width={120} height={16} />
          <Skeleton width={40} height={16} />
        </div>
        <Skeleton className="w-full h-2 rounded-full" />
      </div>
      {/* Phase cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton width="60%" height={20} />
            </div>
            <Skeleton variant="text" lines={2} />
            <div className="flex gap-2">
              <Skeleton width={60} height={24} className="rounded-full" />
              <Skeleton width={60} height={24} className="rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
