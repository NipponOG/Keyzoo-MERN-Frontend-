import { useCallback, useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Turnstile from "react-turnstile";
import { ArrowLeft, Eye, EyeOff, Globe, Loader2, ShieldCheck, Zap } from "lucide-react";
import { DiscordIcon, GoogleIcon } from "@dev.icons/react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

/* -------------------------------------------------------------------------- */
/*  Config + helpers                                                           */
/* -------------------------------------------------------------------------- */

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

// Add { id: "facebook", label: "Meta", Icon: MetaIcon } here once the backend
// has an /auth/facebook route. The old Meta button had no handler at all.
const SOCIAL_PROVIDERS = [
  { id: "google", label: "Google", Icon: GoogleIcon },
  { id: "discord", label: "Discord", Icon: DiscordIcon },
];

const BENEFITS = [
  { Icon: Zap, title: "Instant delivery", text: "Get your code right after payment." },
  { Icon: ShieldCheck, title: "Secure payments", text: "Protected checkout, every time." },
  { Icon: Globe, title: "Global marketplace", text: "Games, gift cards, DLCs and subscriptions." },
];

const INPUT =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 dark:border-white/10 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500";

const LABEL = "mb-1.5 block text-sm font-medium text-gray-700 dark:text-neutral-300";

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500";

// Only same-site paths: "/orders" is fine, "//evil.com" and "https://…" are not
function getSafeRedirect(value) {
  const path = Array.isArray(value) ? value[0] : value;
  if (typeof path !== "string") return null;
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith("/\\")) return null;
  if (path.startsWith("/sign-in")) return null;
  return path;
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
      className={`rounded-lg px-3 py-2 text-sm ${
        isError
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

function PasswordField({ id, value, onChange }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name="password"
        type={visible ? "text" : "password"}
        autoComplete="current-password"
        required
        value={value}
        onChange={onChange}
        placeholder="Enter your password"
        className={`${INPUT} pr-12`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className={`absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-2 text-gray-500 transition hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white ${FOCUS}`}
      >
        {visible ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function SignInPage() {
  const router = useRouter();
  const { user, loading: authLoading, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [captchaKey, setCaptchaKey] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaMode, setMfaMode] = useState("totp"); // "totp" | "recovery"
  const [mfaCode, setMfaCode] = useState("");
  const [mfaChallengeToken, setMfaChallengeToken] = useState("");

  const mfaInputRef = useRef(null);
  const navigatingRef = useRef(false);

  const resetCaptcha = useCallback(() => {
    setTurnstileToken("");
    setCaptchaKey((k) => k + 1); // remounting gives a fresh challenge
  }, []);

  // Already signed in? Skip this page. (Not while we are the ones signing in.)
  useEffect(() => {
    if (!router.isReady || authLoading || !user || navigatingRef.current) return;
    router.replace(getSafeRedirect(router.query.redirect) || "/");
  }, [router, authLoading, user]);

  const completeLogin = useCallback(
    (authData) => {
      navigatingRef.current = true;

      localStorage.setItem("jwt", authData.jwt);
      localStorage.setItem("user", JSON.stringify(authData.user));
      login(authData.user, authData.jwt);

      const isAdmin = authData.user?.role?.name === "Admin";
      router.push(isAdmin ? "/admin/orders" : getSafeRedirect(router.query.redirect) || "/");
    },
    [login, router]
  );

  /* ---- step 1: email + password ------------------------------------------- */

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setNotice("");

    if (!turnstileToken) {
      setError("Please complete the security check.");
      return;
    }

    setLoading(true);

    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ identifier: email.trim(), password, turnstileToken }),
      });
      const authData = data.data ?? data;

      if (authData.requiresTwoFactor) {
        setPassword(""); // no need to keep it around once it's verified
        setMfaChallengeToken(authData.challengeToken);
        setMfaRequired(true);
        setNotice("Password verified. Enter your authenticator code to continue.");
        setLoading(false);
        return;
      }

      setNotice("Login successful. Redirecting…");
      completeLogin(authData); // stays in the loading state until the page changes
    } catch (err) {
      setError(err.message || "Login failed");
      resetCaptcha();
      setLoading(false);
    }
  };

  /* ---- step 2: two-factor code --------------------------------------------- */

  const verifyMfa = async (code) => {
    if (loading) return;

    setError("");
    setNotice("");
    setLoading(true);

    try {
      const data = await apiFetch("/auth/2fa/verify", {
        method: "POST",
        body: JSON.stringify({
          challengeToken: mfaChallengeToken,
          code: code.trim().toUpperCase(),
        }),
      });

      setNotice("Login successful. Redirecting…");
      completeLogin(data.data ?? data);
    } catch (err) {
      setError(err.message || "Invalid verification code");
      setMfaCode("");
      setLoading(false);
      mfaInputRef.current?.focus();
    }
  };

  const handleMfaSubmit = (e) => {
    e.preventDefault();
    verifyMfa(mfaCode);
  };

  const handleMfaChange = (e) => {
    const raw = e.target.value;
    const value =
      mfaMode === "totp" ? raw.replace(/\D/g, "").slice(0, 6) : raw.toUpperCase().slice(0, 20);

    setMfaCode(value);

    // authenticator codes are always 6 digits, so send as soon as they're complete
    if (mfaMode === "totp" && value.length === 6) verifyMfa(value);
  };

  const toggleMfaMode = () => {
    setMfaMode((m) => (m === "totp" ? "recovery" : "totp"));
    setMfaCode("");
    setError("");
    mfaInputRef.current?.focus();
  };

  const backToLogin = () => {
    setMfaRequired(false);
    setMfaChallengeToken("");
    setMfaCode("");
    setMfaMode("totp");
    setError("");
    setNotice("");
    resetCaptcha(); // the previous token was already used
  };

  /* ---- render --------------------------------------------------------------- */

  return (
    <>
      <Head>
        <title>Sign in | Keyzoo</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="flex min-h-screen items-center justify-center px-4 py-10 text-gray-900 dark:text-white sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-[#1a1a1a] dark:shadow-none md:flex">
          {/* Form */}
          <div className="w-full p-6 sm:p-10 md:w-1/2">
            {mfaRequired ? (
              <>
                <button
                  type="button"
                  onClick={backToLogin}
                  className={`mb-6 flex cursor-pointer items-center gap-1.5 rounded-md text-sm text-gray-500 transition hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white ${FOCUS}`}
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Back to login
                </button>

                <h1 className="text-3xl font-bold tracking-tight">Two-step verification</h1>
                <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
                  {mfaMode === "totp"
                    ? "Open your authenticator app and enter the 6-digit code."
                    : "Enter one of your saved recovery codes."}
                </p>

                <form onSubmit={handleMfaSubmit} className="mt-8 flex flex-col gap-4">
                  <div>
                    <label htmlFor="mfa-code" className={LABEL}>
                      {mfaMode === "totp" ? "Authentication code" : "Recovery code"}
                    </label>
                    <input
                      id="mfa-code"
                      ref={mfaInputRef}
                      autoFocus
                      required
                      type="text"
                      name="code"
                      inputMode={mfaMode === "totp" ? "numeric" : "text"}
                      pattern={mfaMode === "totp" ? "[0-9]{6}" : undefined}
                      autoComplete={mfaMode === "totp" ? "one-time-code" : "off"}
                      autoCapitalize="characters"
                      spellCheck={false}
                      maxLength={mfaMode === "totp" ? 6 : 20}
                      value={mfaCode}
                      onChange={handleMfaChange}
                      placeholder={mfaMode === "totp" ? "000000" : "KZ-XXXXXXXX-XXXXXXXX"}
                      className={`${INPUT} text-center tracking-widest`}
                    />
                  </div>

                  <Alert type="error">{error}</Alert>
                  <Alert type="success">{notice}</Alert>

                  <SubmitButton loading={loading} loadingText="Verifying…">
                    Verify &amp; login
                  </SubmitButton>

                  <button
                    type="button"
                    onClick={toggleMfaMode}
                    className={`cursor-pointer rounded-md text-center text-sm font-medium text-purple-600 transition hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 ${FOCUS}`}
                  >
                    {mfaMode === "totp"
                      ? "Use a recovery code instead"
                      : "Use authenticator code instead"}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
                <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
                  Sign in to your Keyzoo account.
                </p>

                {/* Social sign-in: plain links, so they work without JavaScript */}
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
                    or continue with email
                  </span>
                  <div className="h-px flex-1 bg-gray-200 dark:bg-neutral-700" />
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="email" className={LABEL}>
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="username"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={INPUT}
                    />
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-neutral-300">
                        Password
                      </label>
                      <Link
                        href="/forgot-password"
                        className={`rounded text-sm text-purple-600 transition hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 ${FOCUS}`}
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <PasswordField
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
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

                  <SubmitButton loading={loading} loadingText="Logging in…">
                    Login
                  </SubmitButton>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500 dark:text-neutral-400">
                  Don’t have an account?{" "}
                  <Link
                    href="/sign-up"
                    className={`rounded font-semibold text-gray-900 hover:underline dark:text-white ${FOCUS}`}
                  >
                    Sign up
                  </Link>
                </p>
              </>
            )}
          </div>

          {/* Brand panel (desktop only; its image is lazy, so phones never download it) */}
          <div className="relative hidden overflow-hidden bg-[#190B30] p-8 text-white md:flex md:w-1/2 md:flex-col md:items-center md:justify-center">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6d3cff]/40 blur-3xl"
            />

            <Image
              src="/3d/login.png"
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