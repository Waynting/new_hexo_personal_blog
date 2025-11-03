import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  container?: boolean
  size?: "sm" | "md" | "lg" | "xl" | "full"
}

const sizeClasses = {
  sm: "max-w-2xl",
  md: "max-w-4xl", 
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full"
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, container = true, size = "lg", children, ...props }, ref) => (
    <section
      ref={ref}
      className={cn("py-6 md:py-8 lg:py-12", className)}
      {...props}
    >
      {container ? (
        <div className={cn("container mx-auto px-4 sm:px-6 lg:px-8", sizeClasses[size])}>
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  )
)
Section.displayName = "Section"

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "left" | "center" | "right"
}

const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  ({ className, align = "center", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "mb-4 md:mb-6",
        align === "center" && "text-center",
        align === "left" && "text-left",
        align === "right" && "text-right",
        className
      )}
      {...props}
    />
  )
)
SectionHeader.displayName = "SectionHeader"

const SectionTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground",
      className
    )}
    {...props}
  />
))
SectionTitle.displayName = "SectionTitle"

const SectionDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto",
      className
    )}
    {...props}
  />
))
SectionDescription.displayName = "SectionDescription"

const SectionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
SectionContent.displayName = "SectionContent"

export {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionContent,
}

