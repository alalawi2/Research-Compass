import * as React from "react";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * PageTransition - Wraps page content with smooth enter animation
 *
 * Usage:
 * <PageTransition>
 *   <YourPageContent />
 * </PageTransition>
 */
export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <div
      className={cn(
        "animate-in fade-in-0 slide-in-from-bottom-4 duration-300 ease-out",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * SlideIn - Animate elements sliding in from a direction
 */
interface SlideInProps {
  children: React.ReactNode;
  direction?: "left" | "right" | "top" | "bottom";
  delay?: number;
  className?: string;
}

export function SlideIn({
  children,
  direction = "bottom",
  delay = 0,
  className,
}: SlideInProps) {
  const directionClasses = {
    left: "slide-in-from-left-4",
    right: "slide-in-from-right-4",
    top: "slide-in-from-top-4",
    bottom: "slide-in-from-bottom-4",
  };

  return (
    <div
      className={cn(
        "animate-in fade-in-0",
        directionClasses[direction],
        "duration-300 ease-out",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/**
 * FadeIn - Simple fade animation with optional scale
 */
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  scale?: boolean;
  className?: string;
}

export function FadeIn({
  children,
  delay = 0,
  scale = false,
  className,
}: FadeInProps) {
  return (
    <div
      className={cn(
        "animate-in fade-in-0 duration-300 ease-out",
        scale && "zoom-in-95",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/**
 * StaggerContainer - Container that staggers children animations
 */
interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  staggerDelay = 50,
  className,
}: StaggerContainerProps) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <div
          className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300 ease-out"
          style={{ animationDelay: `${index * staggerDelay}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

/**
 * Pulse - Subtle pulse animation for emphasis
 */
interface PulseProps {
  children: React.ReactNode;
  className?: string;
}

export function Pulse({ children, className }: PulseProps) {
  return (
    <div className={cn("animate-pulse", className)}>{children}</div>
  );
}

/**
 * Bounce - Bounce animation for attention
 */
interface BounceProps {
  children: React.ReactNode;
  className?: string;
}

export function Bounce({ children, className }: BounceProps) {
  return (
    <div className={cn("animate-bounce", className)}>{children}</div>
  );
}

/**
 * Shimmer - Shimmer effect for loading states
 */
export function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-muted",
        "before:absolute before:inset-0",
        "before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
        "before:animate-shimmer",
        className
      )}
    />
  );
}
