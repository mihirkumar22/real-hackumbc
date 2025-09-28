import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform translate-y-0",
  {
    variants: {
      variant: {
        default: "bg-green-500 text-white border-2 border-green-600 shadow-[0_6px_0_rgb(21,128,61)] hover:bg-green-600 hover:border-green-700 hover:shadow-[0_4px_0_rgb(20,83,45)] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-[0_2px_0_rgb(20,83,45)]",
        destructive:
          "bg-red-500 text-white border-2 border-red-600 shadow-[0_6px_0_rgb(185,28,28)] hover:bg-red-600 hover:border-red-700 hover:shadow-[0_4px_0_rgb(153,27,27)] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-[0_2px_0_rgb(153,27,27)]",
        outline:
          "border-2 border-green-300 bg-white text-green-600 shadow-[0_6px_0_rgb(134,239,172)] hover:bg-green-50 hover:border-green-400 hover:shadow-[0_4px_0_rgb(110,231,183)] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-[0_2px_0_rgb(110,231,183)]",
        secondary:
          "bg-gray-500 text-white border-2 border-gray-600 shadow-[0_6px_0_rgb(75,85,99)] hover:bg-gray-600 hover:border-gray-700 hover:shadow-[0_4px_0_rgb(55,65,81)] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-[0_2px_0_rgb(55,65,81)]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }