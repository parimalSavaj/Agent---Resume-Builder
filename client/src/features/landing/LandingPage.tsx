import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, FolderKanban, Sparkles, Wand2, ShieldCheck, Zap, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/lib/ThemeToggle";
import { APP_NAME, APP_TAGLINE } from "@/lib/branding";

const FEATURES = [
  {
    icon: FolderKanban,
    title: "One master vault",
    description:
      "Store every work experience, project, certification, and skill once. Stop rewriting the same bullet points across a dozen resume files.",
  },
  {
    icon: Wand2,
    title: "AI-assisted rewrites",
    description:
      "Turn a rough sentence into a sharp, results-driven bullet point, powered by the OpenRouter models under the hood.",
  },
  {
    icon: Layers,
    title: "Tailored in seconds",
    description:
      "Mix and match entries from your vault to assemble a role-specific resume without starting from a blank page.",
  },
  {
    icon: ShieldCheck,
    title: "Your data, your account",
    description:
      "Simple username and password auth, no third-party trackers riding along with your career history.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Fill your vault",
    description: "Add work experience, projects, education, certifications, and skills once.",
  },
  {
    step: "02",
    title: "Refine with AI",
    description: "Sharpen bullet points and tag entries so they surface for the right roles.",
  },
  {
    step: "03",
    title: "Ship a tailored resume",
    description: "Pull exactly what a role needs from your vault, every time you apply.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-grid">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
          <div className="relative mx-auto max-w-6xl px-4 py-24 text-center sm:py-32">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI-assisted resume building
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mx-auto max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-6xl"
            >
              <span className="text-gradient-brand">{APP_NAME}</span> keeps your
              career in one place.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground"
            >
              {APP_TAGLINE} Build a master vault of your experience once, then
              assemble a tailored, polished resume for every application.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <Button size="lg" asChild>
                <Link to="/signup">
                  Start your vault
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">I already have an account</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything your resume needs, nothing it doesn't
            </h2>
            <p className="mt-4 text-muted-foreground">
              A focused toolset built around one idea: your career data should live in
              exactly one place.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-primary/15 to-accent-2/15 text-primary">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-base font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="border-y border-border/60 bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Three steps, every time you apply
              </h2>
            </div>

            <div className="mt-14 grid gap-8 sm:grid-cols-3">
              {STEPS.map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="relative"
                >
                  <span className="font-display text-5xl font-bold text-primary/15">
                    {item.step}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-accent-2/10 px-8 py-16 text-center shadow-lg"
          >
            <Zap className="mx-auto mb-4 h-8 w-8 text-primary" />
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Build your vault in the next five minutes
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted-foreground">
              No credit card, no third-party login. Just a username, a password, and
              your career history.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link to="/signup">
                Create your account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row">
          <Logo iconClassName="h-5 w-5" textClassName="text-sm" />
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
