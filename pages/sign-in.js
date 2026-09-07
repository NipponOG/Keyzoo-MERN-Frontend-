import PasswordInput from "@/components/PasswordInput";
import { React, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import LoadingButton from "@/components/LoadingButton";
import Turnstile from "react-turnstile"; // Note: Turnstile is imported but not used in this code.
// import { signIn } from "next-auth/react";


export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [captchaKey, setCaptchaKey] = useState(Date.now());
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();
  const turnstileRef = useRef(null);


  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess("");

    if (!turnstileToken) {
      setError("Please complete the security check");
      setLoading(false);
      return;
    }


    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier: email,
            password: password,
            turnstileToken,
          }),
        });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("jwt", data.jwt);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Update AuthContext immediately
        login(data.user, data.jwt);
        setSuccess("Login successful!");

        const isAdmin = data.user.role?.name === "Admin";

        setTimeout(() => {
          if (isAdmin) {
            router.push("/admin/orders"); // admin panel
          } else {
            router.push("/"); // normal user
          }
        }, 600);

      } else {
        setError(data.error?.message || "Login failed");

        // ⭐ AUTO-RESET TURNSTILE
        turnstileRef.current?.reset();
        setTurnstileToken("");
        setCaptchaKey(Date.now());  // ⭐ Force re-render
      }
    } catch (err) {
      setError("Something went wrong");

      // ⭐ AUTO-RESET TURNSTILE
      turnstileRef.current?.reset();
      setTurnstileToken("");
      setCaptchaKey(Date.now());  // ⭐ Force re-render
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] text-white px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-2xl overflow-hidden border border-neutral-800 shadow-lg shadow-black/30">
        {/* Left: Form Section */}
        <div className="w-full md:w-1/2 bg-[#1a1a1a] p-6 sm:p-8 flex flex-col justify-center gap-6">
          <h2 className="text-3xl font-bold text-center md:text-left">
            Welcome back 👋
          </h2>

          {/* Social Buttons */}
          <div className="space-y-3">
            {[
              {
                src: "https://driffle.com/icons/google-icon.svg",
                text: "Continue with Google",
              },
              {
                src: "https://driffle.com/icons/facebook-round-icon.svg",
                text: "Continue with Facebook",
              },
              {
                src: "https://driffle.com/icons/discord-icon-new.svg",
                text: "Continue with Discord",
              },
            ].map((btn, i) => (
              <button
                key={i}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-md bg-neutral-800 hover:bg-white hover:text-black transition-all duration-300 text-sm font-medium"
              >
                <img src={btn.src} alt={btn.text} className="w-5 h-5" />
                {btn.text}
              </button>
            ))}
            {/* <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-md bg-neutral-800 hover:bg-white hover:text-black transition-all duration-300 text-sm font-medium"
            >
              <img src="https://driffle.com/icons/google-icon.svg" className="w-5 h-5" />
              Continue with Google
            </button> */}
          </div>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-neutral-700" />
            <span className="px-3 text-neutral-400 text-sm">or</span>
            <div className="flex-1 h-px bg-neutral-700" />
          </div>

          {/* Email & Password Form */}
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
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
              <label className="text-sm text-neutral-400">Password</label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            {/* Feedback */}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            {/* Submit Button */}
            {/* <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-md font-semibold text-white text-sm transition-all ${
                loading
                  ? "bg-neutral-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-blue-500 hover:opacity-90 shadow-md shadow-purple-500/20"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button> */}
            <Turnstile
              key={captchaKey}
              ref={turnstileRef}
              sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              onVerify={(token) => setTurnstileToken(token)}
            />

            <LoadingButton type="submit" loading={loading}>
              {loading ? "Logging in..." : "Login"}
            </LoadingButton>
          </form>

          {/* Footer Links */}
          <div className="flex flex-col sm:flex-row justify-between text-sm text-neutral-400 mt-4 gap-2 sm:gap-0">
            <a href="/sign-up" className="hover:text-purple-400 transition">
              Don’t have an account? <span className="font-medium">Sign up</span>
            </a>
            <a href="/forgot-password" className="hover:text-purple-400 transition">
              Forgot password?
            </a>
          </div>
        </div>

        {/* Right: Image Section */}
        <div className="hidden md:flex w-1/2 bg-[#121212] items-center justify-center p-6">
          <Image
            src="/3d/login.png"
            alt="Login Illustration"
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
