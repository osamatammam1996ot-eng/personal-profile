import * as React from "react"
import { Hexagon } from "lucide-react"
import { cn } from "./utils"

export interface CTAButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "primary" | "secondary"
}

const CTAButton = React.forwardRef<HTMLButtonElement, CTAButtonProps>(
  ({ className, children, variant = "primary", ...props }, ref) => {
    
    if (variant === "secondary") {
      return (
        <button
          ref={ref}
          className={cn(
            "relative inline-flex items-center justify-center cursor-pointer outline-none",
            "font-medium text-base",
            "px-8 py-4 rounded-xl",
            "border border-brand/30 dark:border-brand/40 text-brand dark:text-white/90",
            "bg-brand/5 dark:bg-brand/10",
            "hover:bg-brand/15 dark:hover:bg-brand/20 hover:border-brand dark:hover:border-brand",
            "transition-all duration-300",
            "focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            className
          )}
          {...props}
        >
          {children}
        </button>
      )
    }

    return (
      <button
        ref={ref}
        className={cn(
          "group relative inline-flex items-center justify-center cursor-pointer outline-none",
          "font-medium text-base",
          "px-8 py-4 rounded-xl",
          "bg-gradient-to-b from-[#40208a] to-[#2b1263] text-white",
          "border border-white/5 shadow-[0_0_15px_rgba(109,79,184,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)]",
          "transition-all duration-300 hover:shadow-[0_0_20px_rgba(109,79,184,0.3)]",
          "focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "z-0 overflow-hidden",
          className
        )}
        {...props}
      >
        {/* Floating Hexagons Background */}
        <div className="absolute inset-0 w-full h-[200%] top-0 left-0 pointer-events-none opacity-40 animate-[bubbles_5s_linear_infinite_both]">
           {/* First Half (0% to 50%) */}
           <Hexagon className="absolute left-[20%] top-[10%] w-4 h-4 text-white fill-transparent opacity-20" />
           <Hexagon className="absolute left-[75%] top-[20%] w-6 h-6 text-white fill-transparent opacity-10" />
           <Hexagon className="absolute left-[46%] top-[30%] w-5 h-5 text-white fill-white opacity-10" />
           <Hexagon className="absolute left-[15%] top-[45%] w-4 h-4 text-white fill-transparent opacity-20" />
           <Hexagon className="absolute left-[80%] top-[40%] w-5 h-5 text-white fill-white opacity-10" />
           
           {/* Second Half (50% to 100%) - Exact copy of first half with top + 50% */}
           <Hexagon className="absolute left-[20%] top-[60%] w-4 h-4 text-white fill-transparent opacity-20" />
           <Hexagon className="absolute left-[75%] top-[70%] w-6 h-6 text-white fill-transparent opacity-10" />
           <Hexagon className="absolute left-[46%] top-[80%] w-5 h-5 text-white fill-white opacity-10" />
           <Hexagon className="absolute left-[15%] top-[95%] w-4 h-4 text-white fill-transparent opacity-20" />
           <Hexagon className="absolute left-[80%] top-[90%] w-5 h-5 text-white fill-white opacity-10" />
        </div>

        {/* Bold Text (Main button text, at the bottom of the stack) */}
        <div className="relative z-10 flex items-center justify-center pointer-events-none">
          <span className="flex items-center justify-center gap-2 font-medium whitespace-nowrap">
            {children}
          </span>
        </div>

        {/* Hover Zones */}
        <div className="absolute top-0 right-[66%] w-full h-full z-20 peer/left"></div>
        <div className="absolute top-0 left-[66%] w-full h-full z-20 peer/right"></div>
        
        {/* Mask Block (.right::after) */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center pointer-events-none z-30",
          "transition-transform duration-[400ms] ease-out origin-center",
          "transform -translate-y-[100%] rotate-0",
          "group-hover:-translate-y-[47%] group-hover:rotate-0",
          "peer-hover/right:-translate-y-[50%] peer-hover/right:-rotate-[7deg]",
          "peer-hover/left:-translate-y-[50%] peer-hover/left:rotate-[7deg]",
          "bg-surface dark:bg-surface text-transparent"
        )}>
          {/* We use large padding to create a large block that can cover the button diagonally */}
          <span className="px-[60px] py-[60px] whitespace-nowrap">
            {children}
          </span>
        </div>

        {/* Thin Text (on top of everything) */}
        {/* Uses text-brand in light mode, text-white in dark mode so it's invisible on the button but visible on the mask block */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 text-brand dark:text-white">
           <span className="flex items-center justify-center gap-2 font-medium whitespace-nowrap">
             {children}
           </span>
        </div>
      </button>
    )
  }
)
CTAButton.displayName = "CTAButton"

export { CTAButton }
