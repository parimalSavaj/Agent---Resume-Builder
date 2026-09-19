import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/branding";

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  /** Hide the wordmark and only show the icon mark. */
  iconOnly?: boolean;
}

/**
 * App wordmark: the brand icon mark (mirrors public/favicon.svg) paired with the
 * product name. Rendered inline as SVG so it inherits currentColor-free brand hues
 * and stays crisp at any size without an extra asset request.
 */
export function Logo({ className, iconClassName, textClassName, iconOnly = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 48 46"
        className={cn("h-7 w-7 shrink-0", iconClassName)}
        aria-hidden="true"
        role="img"
      >
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent-2))" />
          </linearGradient>
        </defs>
        <path
          fill="url(#logo-grad)"
          d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"
        />
      </svg>
      {!iconOnly && (
        <span className={cn("font-display text-lg font-semibold tracking-tight", textClassName)}>
          {APP_NAME}
        </span>
      )}
    </div>
  );
}
