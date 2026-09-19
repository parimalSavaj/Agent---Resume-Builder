import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { useAuth } from "./AuthContext";
import { signupFormSchema } from "./schemas";
import type { SignupFormValues } from "./schemas";
import { AuthShell } from "./AuthShell";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({ resolver: zodResolver(signupFormSchema) });

  const onSubmit = async (values: SignupFormValues) => {
    setServerError(null);
    try {
      await signup(values.username, values.password);
      navigate("/vault", { replace: true });
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
      title="Create your vault"
      subtitle="Username and password only, no third-party login required."
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
              autoComplete="new-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          {serverError && <p className="text-sm text-destructive">{serverError}</p>}

          <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </CardContent>
    </AuthShell>
  );
}
