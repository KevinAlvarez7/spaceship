import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "font-base inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-cyan-900 text-cyan-300 hover:bg-cyan-800 active:bg-cyan-700 disabled:bg-cyan-950 disabled:text-cyan-800",
        secondary: "bg-stone-800 text-white hover:bg-stone-700 active:bg-stone-700 disabled:bg-stone-900 disabled:text-stone-700",
        "outline-primary": "border-2 border-cyan-800 bg-transparent text-cyan-800 hover:bg-cyan-50 active:bg-cyan-100 disabled:border-cyan-300 disabled:text-cyan-300",
        "outline-secondary": "border-2 border-stone-800 bg-transparent text-stone-800 hover:bg-stone-50 active:bg-stone-100 disabled:border-stone-300 disabled:text-stone-300",
        "ghost-primary": "bg-transparent text-cyan-800 hover:bg-cyan-100 active:bg-cyan-200 disabled:text-cyan-300",
        "ghost-secondary": "bg-transparent text-neutral-500 hover:text-neutral-300 active:bg-neutral-800 disabled:text-neutral-700",
        destructive: "bg-red-800 text-white hover:bg-red-700 active:bg-red-700 disabled:bg-red-900 disabled:text-red-700",
        "outline-destructive": "border-2 border-red-800 bg-transparent text-red-800 hover:bg-red-50 active:bg-red-100 disabled:border-red-300 disabled:text-red-300",
        "ghost-destructive": "bg-transparent text-red-800 hover:bg-red-100 active:bg-red-200 disabled:text-red-300",
        "link-primary": "bg-transparent text-cyan-800 hover:underline active:text-cyan-900 disabled:text-cyan-300",
        "link-secondary": "bg-transparent text-stone-800 hover:underline active:text-stone-900 disabled:text-stone-300",
      },
      size: {
        default: "py-2 px-4 ",
        sm: "rounded-md py-2 px-3 text-xs",
        lg: "rounded-md py-4 px-8 text-base",
        icon: "p-2",
      },
      iconPosition: {
        none: "",
        leading: "flex-row",
        trailing: "flex-row-reverse",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      iconPosition: "none",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, iconPosition, icon, children, ...props }, ref) => {
    // Only adjust size if there's text content, not just React elements
    const hasTextContent = React.Children.toArray(children).some(
      child => typeof child === 'string'
    );
    const adjustedSize = size === "icon" && hasTextContent ? "default" : size;
    
    // Only add gap if there's both an icon and text
    const hasIconAndText = icon && children;
    const gapClass = hasIconAndText ? "gap-2" : "";

    return (
      <button
        className={cn(
          buttonVariants({ variant, size: adjustedSize, iconPosition }),
          gapClass,
          className
        )}
        ref={ref}
        {...props}
      >
        {icon}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }