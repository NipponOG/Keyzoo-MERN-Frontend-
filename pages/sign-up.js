import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Turnstile from "react-turnstile";
import { Eye, EyeOff, Globe, Loader2, ShieldCheck, Zap } from "lucide-react";
import { DiscordIcon, GoogleIcon } from "@dev.icons/react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

/* -------------------------------------------------------------------------- */
/*  Config + helpers                                                           */
/* -------------------------------------------------------------------------- */

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const MIN_AGE = 13; // adjust to your policy
const MIN_PASSWORD_LENGTH = 8; // keep in sync with your backend rules

// Add { id: "facebook", label: "Meta", Icon: MetaIcon } here once the backend
// has an /auth/facebook route.
const SOCIAL_PROVIDERS = [
  { id: "google", label: "Google", Icon: GoogleIcon },
  { id: "discord", label: "Discord", Icon: DiscordIcon },
];

const BENEFITS = [
  { Icon: Zap, title: "Instant delivery", text: "Get your code right after payment." },
  { Icon: ShieldCheck, title: "Secure payments", text: "Protected checkout, every time." },
  { Icon: Globe, title: "Global marketplace", text: "Games, gift cards, DLCs and subscriptions." },
];

const INPUT_BASE =
  "w-full rounded-xl border bg-gray-50 px-4 py-3 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500";

const inputClass = (error) =>
  `${INPUT_BASE} ${error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
    : "border-gray-200 focus:border-purple-500 focus:ring-purple-500/30 dark:border-white/10"
  }`;

const LABEL = "mb-1.5 block text-sm font-medium text-gray-700 dark:text-neutral-300";

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500";

// Two columns only where the form column is wide enough:
// - 640-767px: card is single column, so 2 cols fit
// - 768-1023px: form is half the card, so back to 1 col
// - 1024px+: form column is wide enough again
const TWO_COL = "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2";

// Only same-site paths: "/orders" is fine, "//evil.com" and "https://…" are not
function getSafeRedirect(value) {
  const path = Array.isArray(value) ? value[0] : value;
  if (typeof path !== "string") return null;
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith("/\\")) return null;
  if (path.startsWith("/sign-in") || path.startsWith("/sign-up")) return null;
  return path;
}

function getAge(iso) {
  const dob = new Date(iso);
  if (Number.isNaN(dob.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

/* -------------------------------------------------------------------------- */
/*  Small UI pieces                                                            */
/* -------------------------------------------------------------------------- */

function Alert({ type, children }) {
  if (!children) return null;
  const isError = type === "error";

  return (
    <p
      role={isError ? "alert" : "status"}
      className={`rounded-lg px-3 py-2 text-sm ${isError
          ? "bg-red-500/10 text-red-600 dark:text-red-400"
          : "bg-green-500/10 text-green-700 dark:text-green-400"
        }`}
    >
      {children}
    </p>
  );
}

function SubmitButton({ loading, loadingText, children }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#6d3cff] px-4 py-3 font-semibold text-white transition hover:bg-[#5a2ee6] disabled:cursor-not-allowed disabled:opacity-70 ${FOCUS}`}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {loading ? loadingText : children}
    </button>
  );
}

function Field({ id, label, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-gray-500 dark:text-neutral-400">{hint}</p>
      ) : null}
    </div>
  );
}

function PasswordField({ id, name, value, onChange, placeholder, error }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        autoComplete="new-password"
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputClass(error)} pr-12`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className={`absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-2 text-gray-500 transition hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white ${FOCUS}`}
      >
        {visible ? (
          <EyeOff className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Eye className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function SignUpPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [turnstileToken, setTurnstileToken] = useState("");
  const [captchaKey, setCaptchaKey] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [done, setDone] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const resetCaptcha = useCallback(() => {
    setTurnstileToken("");
    setCaptchaKey((k) => k + 1); // remounting gives a fresh challenge
  }, []);

  // Already signed in? Skip this page.
  useEffect(() => {
    if (!router.isReady || authLoading || !user || done) return;
    router.replace(getSafeRedirect(router.query.redirect) || "/");
  }, [router, authLoading, user, done]);

  // After a successful sign-up, send them to sign in (keeping any ?redirect=)
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => {
      const redirect = getSafeRedirect(router.query.redirect);
      router.push(redirect ? `/sign-in?redirect=${encodeURIComponent(redirect)}` : "/sign-in");
    }, 1200);
    return () => clearTimeout(t);
  }, [done, router]);

  const setField = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const onChange = (name) => (e) => setField(name, e.target.value);

  const validate = () => {
    const next = {};

    if (!/^\d{10}$/.test(form.phone)) {
      next.phone = "Enter a 10-digit phone number";
    }

    const age = getAge(form.dateOfBirth);
    if (age === null || age < 0) {
      next.dateOfBirth = "Enter a valid date of birth";
    } else if (age < MIN_AGE) {
      next.dateOfBirth = `You must be at least ${MIN_AGE} years old`;
    }

    if (form.password.length < MIN_PASSWORD_LENGTH) {
      next.password = `Use at least ${MIN_PASSWORD_LENGTH} characters`;
    }

    if (form.password !== form.confirmPassword) {
      next.confirmPassword = "Passwords do not match";
    }

    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || done) return;

    setError("");
    setNotice("");

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    if (!turnstileToken) {
      setError("Please complete the security check.");
      return;
    }

    setLoading(true);

    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone,
          password: form.password,
          dateOfBirth: form.dateOfBirth,
          turnstileToken,
        }),
      });

      setNotice("Account created! Redirecting you to sign in…");
      setDone(true); // stays in the loading state until the page changes
    } catch (err) {
      setError(err.message || "Registration failed");
      resetCaptcha(); // Turnstile tokens are single-use
      setLoading(false);
    }
  };

  /* ---- render --------------------------------------------------------------- */

  return (
    <>
      <Head>
        <title>Create account | Keyzoo</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="flex min-h-screen items-center justify-center px-4 py-10 text-gray-900 dark:text-white sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-[#1a1a1a] dark:shadow-none md:flex">
          {/* Form */}
          <div className="w-full p-6 sm:p-10 md:w-1/2">
            <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
              Join Keyzoo to start shopping.
            </p>

            {/* Social sign-up: plain links, so they work without JavaScript */}
            <div className="mt-8 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
              {SOCIAL_PROVIDERS.map(({ id, label, Icon }) => (
                <a
                  key={id}
                  href={`${API_URL}/auth/${id}`}
                  className={`flex items-center justify-center gap-2.5 rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium transition hover:bg-gray-50 dark:border-white/10 dark:bg-neutral-800 dark:hover:bg-neutral-700 ${FOCUS}`}
                >
                  <Icon size={22} aria-hidden="true" />
                  {label}
                </a>
              ))}
            </div>

            <div className="my-6 flex items-center">
              <div className="h-px flex-1 bg-gray-200 dark:bg-neutral-700" />
              <span className="px-3 text-sm text-gray-500 dark:text-neutral-400">
                or sign up with email
              </span>
              <div className="h-px flex-1 bg-gray-200 dark:bg-neutral-700" />
            </div>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <div className={TWO_COL}>
                <Field id="firstName" label="First name">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={form.firstName}
                    onChange={onChange("firstName")}
                    placeholder="First name"
                    className={inputClass()}
                  />
                </Field>

                <Field id="lastName" label="Last name">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={form.lastName}
                    onChange={onChange("lastName")}
                    placeholder="Last name"
                    className={inputClass()}
                  />
                </Field>
              </div>

              <Field id="email" label="Email">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={onChange("email")}
                  placeholder="you@example.com"
                  className={inputClass()}
                />
              </Field>

              <div className={TWO_COL}>
                <Field id="phone" label="Phone number" error={errors.phone}>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    required
                    value={form.phone}
                    onChange={(e) =>
                      setField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    placeholder="10-digit number"
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    className={inputClass(errors.phone)}
                  />
                </Field>

                <Field id="dateOfBirth" label="Date of birth" error={errors.dateOfBirth}>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    autoComplete="bday"
                    required
                    max={today}
                    value={form.dateOfBirth}
                    onChange={onChange("dateOfBirth")}
                    aria-invalid={Boolean(errors.dateOfBirth)}
                    aria-describedby={errors.dateOfBirth ? "dateOfBirth-error" : undefined}
                    className={`${inputClass(errors.dateOfBirth)} [color-scheme:light] dark:[color-scheme:dark]`}
                  />
                </Field>
              </div>

              <div className={TWO_COL}>
                <Field
                  id="password"
                  label="Password"
                  error={errors.password}
                  hint={`At least ${MIN_PASSWORD_LENGTH} characters`}
                >
                  <PasswordField
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={onChange("password")}
                    placeholder="Create a password"
                    error={errors.password}
                  />
                </Field>

                <Field id="confirmPassword" label="Confirm password" error={errors.confirmPassword}>
                  <PasswordField
                    id="confirmPassword"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={onChange("confirmPassword")}
                    placeholder="Repeat your password"
                    error={errors.confirmPassword}
                  />
                </Field>
              </div>

              {/* reserved height so the widget doesn't shift the layout when it loads */}
              <div className="min-h-[65px]">
                <Turnstile
                  key={captchaKey}
                  sitekey={TURNSTILE_SITE_KEY}
                  theme="auto"
                  onVerify={setTurnstileToken}
                  onExpire={() => setTurnstileToken("")}
                  onError={() => setTurnstileToken("")}
                />
              </div>

              <Alert type="error">{error}</Alert>
              <Alert type="success">{notice}</Alert>

              <SubmitButton loading={loading || done} loadingText={done ? "Redirecting…" : "Creating account…"}>
                Create account
              </SubmitButton>

              <p className="text-center text-xs text-gray-500 dark:text-neutral-400">
                By creating an account, you agree to our{" "}
                <Link
                  href="/policy/terms-and-conditions"
                  className={`rounded underline hover:text-gray-900 dark:hover:text-white ${FOCUS}`}
                >
                  Terms &amp; Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/policy/privacy-policy"
                  className={`rounded underline hover:text-gray-900 dark:hover:text-white ${FOCUS}`}
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500 dark:text-neutral-400">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className={`rounded font-semibold text-gray-900 hover:underline dark:text-white ${FOCUS}`}
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Brand panel (desktop only; its image is lazy, so phones never download it) */}
          <div className="relative hidden overflow-hidden bg-[#190B30] p-8 text-white md:flex md:w-1/2 md:flex-col md:items-center md:justify-center">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6d3cff]/40 blur-3xl"
            />

            <Image
              src="/3d/register.png"
              alt=""
              width={450}
              height={450}
              sizes="(min-width: 768px) 320px, 0px"
              draggable={false}
              className="relative h-auto w-full max-w-[300px] object-contain drop-shadow-2xl"
            />

            <ul className="relative mt-8 w-full max-w-sm space-y-4">
              {BENEFITS.map(({ Icon, title, text }) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <Icon className="h-5 w-5 text-[#b9a4ff]" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{title}</span>
                    <span className="block text-sm text-white/70">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}