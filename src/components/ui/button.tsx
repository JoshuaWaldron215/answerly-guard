import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 hover:shadow-lg",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-secondary hover:border-white/20",
        secondary:
          "bg-secondary text-secondary-foreground border border-white/10 hover:bg-muted hover:border-white/20",
        ghost: 
          "text-muted-foreground hover:text-foreground hover:bg-secondary",
        link: 
          "text-primary underline-offset-4 hover:underline",
        accent:
          "relative overflow-hidden text-white font-semibold shadow-lg hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 bg-gradient-to-r from-accent to-orange-500",
        hero:
          "relative overflow-hidden text-white font-semibold text-base px-8 py-4 shadow-xl hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 bg-gradient-to-r from-accent to-orange-500",
        subtle:
          "bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10 hover:text-foreground hover:border-white/20",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
