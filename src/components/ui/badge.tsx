import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        // destructive:
        //   "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        destructive:
          "border-transparent bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500/20 dark:bg-red-500 dark:hover:bg-red-400 dark:focus-visible:ring-red-400/40",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        success:
          "border-transparent bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500/20 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:focus-visible:ring-emerald-400/40",
        // 🟢 淺底綠
        successSubtle:
          "border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-100 dark:hover:bg-emerald-900/80",

        // 🟡 實心黃（警告）
        warning:
          "border-transparent bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500/20 dark:bg-amber-400 dark:hover:bg-amber-300 dark:focus-visible:ring-amber-300/40",

        // 🟡 淺底黃
        warningSubtle:
          "border-transparent bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-100 dark:hover:bg-amber-900/80",

        // 🔵 實心藍（資訊）
        info:
          "border-transparent bg-sky-500 text-white hover:bg-sky-600 focus-visible:ring-sky-500/20 dark:bg-sky-400 dark:hover:bg-sky-300 dark:focus-visible:ring-sky-300/40",

        // 🔵 淺底藍
        infoSubtle:
          "border-transparent bg-sky-100 text-sky-700 hover:bg-sky-200 dark:bg-sky-900 dark:text-sky-100 dark:hover:bg-sky-900/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
