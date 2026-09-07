import { React, useState, useRef } from "react";
import { useRouter } from "next/router";
import PasswordInput from "@/components/PasswordInput";
import Image from "next/image";
import LoadingButton from "@/components/LoadingButton";
import Link from "next/link";
import Turnstile from "react-turnstile";  // Import Turnstile component
import { signIn } from "next-auth/react";  // Import signIn from next-auth
import { apiFetch } from "@/lib/api";

export default function SignUpPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [turnstileToken, setTurnstileToken] = useState(""); // State for Turnstile token
  const [captchaKey, setCaptchaKey] = useState(Date.now()); // ⭐ NEW: Key to force re-render
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const turnstileRef = useRef(null); // ⭐ NEW: Ref for Turnstile

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!turnstileToken) {
      setError("Please complete the security check");
      setLoading(false);
      return;
    }

    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          dateOfBirth,
          turnstileToken,
        }),
      });

      setSuccess("Account created successfully!");

      setTimeout(() => router.push("/sign-in"), 1000);
    } catch (err) {
      setError(err.message || "Registration failed");

      turnstileRef.current?.reset();
      setTurnstileToken("");
      setCaptchaKey(Date.now());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] text-white px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-0">
      <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-2xl overflow-hidden border border-neutral-800 shadow-lg shadow-black/30">
        {/* Left: Form Section */}
        <div className="w-full md:w-1/2 bg-[#1a1a1a] p-6 sm:p-8 flex flex-col justify-center gap-6 overflow-y-auto md:overflow-visible pb-10 md:pb-6">
          <h2 className="text-3xl font-bold text-center md:text-left">
            Create your account ✨
          </h2>

          {/* Social Buttons */}
          {/* <div className="space-y-3">
            {/* Google */}
          {/* <button className="flex items-center justify-center gap-2 w-full py-3 rounded-md bg-neutral-800 hover:bg-white hover:text-black transition-all duration-300 text-sm font-medium">
              <img
                src="https://driffle.com/icons/google-icon.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Sign up with Google
            </button> */}

          {/* Facebook */}
          {/* <button className="flex items-center justify-center gap-2 w-full py-3 rounded-md bg-neutral-800 hover:bg-white hover:text-black transition-all duration-300 text-sm font-medium">
              <img
                src="https://driffle.com/icons/facebook-round-icon.svg"
                alt="Facebook"
                className="w-5 h-5"
              />
              Sign up with Facebook
            </button> */}

          {/* Discord */}
          {/* <button className="flex items-center justify-center gap-2 w-full py-3 rounded-md bg-neutral-800 hover:bg-white hover:text-black transition-all duration-300 text-sm font-medium">
              <img
                src="https://driffle.com/icons/discord-icon-new.svg"
                alt="Discord"
                className="w-5 h-5"
              />
              Sign up with Discord
            </button> */}
          {/* </div> */}

          <div className="space-y-3">

            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-md bg-neutral-800 hover:bg-white hover:text-black transition-all duration-300 text-sm font-medium"
            >
              <img src="https://driffle.com/icons/google-icon.svg" className="w-5 h-5" />
              Sign up with Google
            </button>

            <button className="flex items-center justify-center gap-2 w-full py-3 rounded-md bg-neutral-800 hover:bg-white hover:text-black transition-all duration-300 text-sm font-medium">
              <img src="https://driffle.com/icons/facebook-round-icon.svg" className="w-5 h-5" />
              Sign up with Facebook
            </button>

            <button className="flex items-center justify-center gap-2 w-full py-3 rounded-md bg-neutral-800 hover:bg-white hover:text-black transition-all duration-300 text-sm font-medium">
              <img src="https://driffle.com/icons/discord-icon-new.svg" className="w-5 h-5" />
              Sign up with Discord
            </button>

          </div>


          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-neutral-700" />
            <span className="px-3 text-neutral-400 text-sm">or</span>
            <div className="flex-1 h-px bg-neutral-700" />
          </div>

          {/* Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <label className="text-sm text-neutral-400">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full mt-1 px-4 py-3 bg-neutral-800 rounded-md text-white outline-none focus:ring-2 focus:ring-purple-500 transition"
                  placeholder="First name"
                />
              </div>

              <div>
                <label className="text-sm text-neutral-400">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full mt-1 px-4 py-3 bg-neutral-800 rounded-md text-white outline-none focus:ring-2 focus:ring-purple-500 transition"
                  placeholder="Last name"
                />
              </div>

            </div>
            <div>
              <label className="text-sm text-neutral-400">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-1 px-4 py-3 bg-neutral-800 rounded-md text-white outline-none focus:ring-2 focus:ring-purple-500 transition"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="text-sm text-neutral-400">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                className="w-full mt-1 px-4 py-3 bg-neutral-800 rounded-md text-white outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>

            <div>
              <label className="text-sm text-neutral-400">Password</label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label className="text-sm text-neutral-400">Confirm Password</label>
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            {/* <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-md font-semibold text-white text-sm flex items-center justify-center gap-2 transition-all ${loading
                  ? "bg-gradient-to-r from-purple-700 to-blue-600 opacity-70 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 shadow-md shadow-purple-500/20"
                }`}
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              )}
              <span className={`${loading ? "opacity-90" : "opacity-100"} transition-opacity`}>
                {loading ? "Signing up..." : "Sign Up"}
              </span>
            </button> */}

            <Turnstile
              key={captchaKey}
              ref={turnstileRef}
              sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              onVerify={(token) => setTurnstileToken(token)}
              className="mt-2"
            />


            <LoadingButton type="submit" loading={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </LoadingButton>


          </form>

          {/* Footer Link */}
          <div className="text-sm text-neutral-400 mt-4 text-center md:text-left">

            <a href="/sign-in" className="hover:text-purple-400 transition font-medium">
              Already have an account? Login
            </a>
          </div>
        </div>

        {/* Right: Illustration */}
        <div className="hidden md:flex w-1/2 bg-[#121212] items-center justify-center p-6">
          <Image
            src="/3d/register.png"
            alt="Register Illustration"
            width={450}
            height={450}
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}
