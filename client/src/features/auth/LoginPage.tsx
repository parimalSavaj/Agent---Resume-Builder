import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { useAuth } from "./AuthContext";
import { loginFormSchema } from "./schemas";
import type { LoginFormValues } from "./schemas";
import { AuthShell } from "./AuthShell";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginFormSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      await login(values.username, values.password);
      const from = (location.state as { from?: Location })?.from?.pathname ?? "/vault";
      navigate(from, { replace: true });
    } catch (err) {
      if (isAxiosError<{ error?: string }>(err) && err.response?.data?.error) {
        setServerError(err.response.data.error);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to access your vault and pick up where you left off."
    >
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input id="username" type="text" autoComplete="username" {...register("username")} />
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          {serverError && <p className="text-sm text-destructive">{serverError}</p>}

          <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
            {isSubmitting ? "Logging in..." : "Log in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardContent>
    </AuthShell>
  );
}
