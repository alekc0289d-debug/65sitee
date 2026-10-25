"use client";

import { cn } from "@/lib/utils/cn";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { InputHTMLAttributes, forwardRef, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  type?: "text" | "tel" | "email" | "password";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, type = "text", ...props }, ref) => {
    const [showPass, setShowPass] = useState(false);
    const isPassword = type === "password";
    const finalType = isPassword && showPass ? "text" : type;

    return (
      <div>
        {label && (
          <label className="block text-sm font-semibold text-stone-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={finalType}
            className={cn(
              "input-field",
              icon && "!pl-12",
              isPassword && "!pr-12",
              error && "input-error",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-600 transition-colors"
              tabIndex={-1}
            >
              {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";