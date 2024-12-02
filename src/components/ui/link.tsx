import * as React from "react"
import { cn } from "@/lib/utils"

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
  className?: string
  asChild?: boolean
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, href, children, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      if (href === "/") {
        window.history.pushState({}, "", href)
        window.dispatchEvent(new PopStateEvent("popstate"))
      }
      onClick?.(e)
    }

    return (
      <a
        ref={ref}
        href={href}
        onClick={handleClick}
        className={cn("hover:opacity-80 transition-opacity", className)}
        {...props}
      >
        {children}
      </a>
    )
  }
)
Link.displayName = "Link"