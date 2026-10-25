import { cn } from "@/lib/utils/cn";
import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(180,83,9,0.08)] border border-amber-100/50",
          hover &&
            "hover:shadow-[0_8px_30px_-6px_rgba(180,83,9,0.15)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";