import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/lib/ThemeToggle";
import { APP_TAGLINE } from "@/lib/branding";

const HIGHLIGHTS = [
  "One vault for every job you apply to",
  "AI-assisted bullet point rewrites",
  "No third-party login, just your account",
];

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

/**
 * Shared two-column shell for auth pages: brand/marketing panel on the left
 * (hidden on small screens), form card on the right.
 */
export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-grid lg:flex lg:flex-col lg:justify-between lg:p-10">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent-2/10" />
        <div className="relative">
          <Link to="/">
            <Logo textClassName="text-xl" />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-md"
        >
          <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight">
            {APP_TAGLINE}
          </h2>
          <ul className="mt-8 space-y-3">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <p className="relative text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Vaultfolio. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="relative flex items-center justify-center px-4 py-12">
        <div className="absolute top-4 right-4 flex items-center gap-2 lg:right-8">
          <ThemeToggle />
        </div>
        <div className="mb-6 lg:hidden absolute top-4 left-4">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-display text-2xl">{title}</CardTitle>
              <CardDescription>{subtitle}</CardDescription>
            </CardHeader>
            {children}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
