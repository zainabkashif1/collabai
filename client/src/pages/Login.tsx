import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { motion } from "motion/react";
import { PageTransition } from "../components/PageTransition";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { AlertBanner } from "../components/ui/AlertBanner";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { loginSchema, type LoginFormValues } from "../validators/auth.schema";
import { ArrowRightIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon, SpinnerIcon } from "../components/ui/Icon";

export default function Login() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    try {
      const res = await api.post("/auth/login", values);
      setSession(res.data.user, res.data.accessToken);
      navigate("/dashboard");
    } catch (err) {
      // The backend intentionally returns the same message for "no such
      // user" and "wrong password" (see auth.controller.ts) — we just
      // surface whatever it sends rather than writing our own copy here.
      if (err instanceof AxiosError && err.response?.data?.error) {
        setServerError(err.response.data.error);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <PageTransition>
      <div className="flex flex-col gap-7">
        <div>
          <p className="eyebrow mb-3">Student workspace</p>
          <h1 className="font-display text-4xl font-semibold tracking-tight">
            Welcome back<span className="text-ember">.</span>
          </h1>
          <p className="text-ink/50 text-sm mt-3">Log in to continue building with your people.</p>
        </div>

        {serverError && <AlertBanner message={serverError} />}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@university.edu"
              icon={<MailIcon className="h-4 w-4" />}
              error={errors.email?.message}
              {...register("email")}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              icon={<LockIcon className="h-4 w-4" />}
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="grid h-7 w-7 place-items-center rounded-md text-ink/40 hover:bg-ink/5 hover:text-ink/70 transition-colors"
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              }
              error={errors.password?.message}
              {...register("password")}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
              {isSubmitting ? (
                <>
                  <SpinnerIcon className="h-4 w-4" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRightIcon className="h-4 w-4" />
                </>
              )}
            </Button>
          </motion.div>
        </form>

        <p className="text-sm text-ink/50 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-signal font-medium">
            Register
          </Link>
        </p>
      </div>
    </PageTransition>
  );
}
