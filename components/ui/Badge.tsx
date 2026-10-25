import { cn } from "@/lib/utils/cn";

type Variant = "success" | "warning" | "danger" | "info" | "neutral" | "amber";

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: "sm" | "md";
  className?: string;
}

export function Badge({ children, variant = "neutral", size = "md", className }: BadgeProps) {
  const variants: Record<Variant, string> = {
    success: "bg-green-100 text-green-700 border-green-200",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
    danger: "bg-red-100 text-red-700 border-red-200",
    info: "bg-blue-100 text-blue-700 border-blue-200",
    neutral: "bg-stone-100 text-stone-600 border-stone-200",
    amber: "bg-amber-100 text-amber-700 border-amber-200",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold rounded-full border",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}