import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  children?: ReactNode;
  className?: string;
  iconClassName?: string;
  animationDelay?: number;
}

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  children,
  className,
  iconClassName,
  animationDelay = 0,
}: StatCardProps) => {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-border/30 bg-card/70 backdrop-blur-xl p-6 shadow-soft transition-all duration-500 hover:shadow-elegant hover:border-primary/20 opacity-0 animate-fade-in-up",
        className
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Animated gradient background */}
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-primary/20 via-accent/15 to-transparent blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-80 animate-pulse-soft" />
      <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-gradient-to-tr from-accent/15 to-transparent blur-2xl transition-all duration-700 group-hover:scale-125" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {title}
          </h3>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 transition-all duration-500 group-hover:scale-110 group-hover:shadow-glow border border-primary/10",
              iconClassName
            )}
          >
            {icon}
          </div>
        </div>

        {/* Value */}
        <div className="mt-5">
          <p className="font-display text-5xl font-semibold tracking-tight text-gradient">
            {value}
          </p>
          {subtitle && (
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {/* Optional children */}
        {children && <div className="mt-5">{children}</div>}
      </div>
    </div>
  );
};

export default StatCard;
