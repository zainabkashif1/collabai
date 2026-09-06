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
import { ProfilePicturePicker } from "../components/profile/ProfilePicturePicker";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { registerSchema, type RegisterFormValues } from "../validators/auth.schema";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  SpinnerIcon,
} from "../components/ui/Icon";

const strengthCopy = ["Weak", "Weak", "Good", "Strong"] as const;
const strengthColor = ["bg-ink/15", "bg-ember", "bg-gold", "bg-mint"] as const;
const strengthTextColor = ["text-ink/40", "text-ember", "text-gold", "text-mint"] as const;

function PasswordChecklist({ password }: { password: string }) {
  const rules = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "An uppercase letter", met: /[A-Z]/.test(password) },
    { label: "A number", met: /[0-9]/.test(password) },
  ];
  const score = rules.filter((r) => r.met).length;

  return (
    <div className="-mt-1">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i < score ? strengthColor[score] : "bg-ink/8"
            }`}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
        <span className={`text-[11px] font-medium ${strengthTextColor[score]}`}>
          {password ? strengthCopy[score] : "Password strength"}
        </span>
        {rules.map((rule) => (
          <span
            key={rule.label}
            className={`flex items-center gap-1 text-[11px] transition-colors ${
              rule.met ? "text-mint" : "text-ink/35"
            }`}
          >
            <CheckCircleIcon className="h-3 w-3" />
            {rule.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");

  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const passwordValue = watch("password") ?? "";

  async function onSubmit(values: RegisterFormValues) {
    setServerError(null);
    try {
      // confirmPassword only exists to validate on the client — the
      // backend's registerSchema doesn't know about it and would reject
      // an unrecognized field under strict parsing, so it's stripped here.
      const { confirmPassword: _confirmPassword, ...payload } = values;
      const res = await api.post("/auth/register", { ...payload, profilePicture });
      setSession(res.data.user, res.data.accessToken);
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.error) {
        setServerError(err.response.data.error);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <PageTransition>
      <div className="flex flex-col gap-6">
        <div>
          <p className="eyebrow mb-2">Student workspace</p>
          <h1 className="font-display text-2xl font-semibold">Create your account</h1>
          <p className="text-ink/50 text-sm mt-1">Find teammates who fit what you're building.</p>
        </div>

        {serverError && <AlertBanner message={serverError} />}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.03 }}
            className="flex flex-col gap-4"
          >
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink/35">Account</p>
            <ProfilePicturePicker name={watch("name") ?? "Your profile"} value={profilePicture} onChange={setProfilePicture} />
            <Input label="Full name" placeholder="Jordan Ahmed" error={errors.name?.message} {...registerField("name")} />
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@university.edu"
              icon={<MailIcon className="h-4 w-4" />}
              error={errors.email?.message}
              {...registerField("email")}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="flex flex-col gap-3"
          >
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink/35">Security</p>
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
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
              {...registerField("password")}
            />
            <PasswordChecklist password={passwordValue} />
            <Input
              label="Confirm password"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              icon={<LockIcon className="h-4 w-4" />}
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  className="grid h-7 w-7 place-items-center rounded-md text-ink/40 hover:bg-ink/5 hover:text-ink/70 transition-colors"
                >
                  {showConfirm ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              }
              error={errors.confirmPassword?.message}
              {...registerField("confirmPassword")}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.13 }}
            className="flex flex-col gap-4"
          >
            <p className="font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-ink/35">
              Academic background
            </p>
            <Input label="University" placeholder="Your university" error={errors.university?.message} {...registerField("university")} />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Degree / program"
                placeholder="BS Computer Science"
                error={errors.degreeProgram?.message}
                {...registerField("degreeProgram")}
              />
              <Input
                label="Graduation year"
                type="number"
                inputMode="numeric"
                error={errors.graduationYear?.message}
                {...registerField("graduationYear")}
              />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
            <Button type="submit" disabled={isSubmitting} className="w-full mt-1">
              {isSubmitting ? (
                <>
                  <SpinnerIcon className="h-4 w-4" />
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <ArrowRightIcon className="h-4 w-4" />
                </>
              )}
            </Button>
          </motion.div>
        </form>

        <p className="text-sm text-ink/50 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-signal font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </PageTransition>
  );
}
