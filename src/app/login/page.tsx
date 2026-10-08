"use client";

import { Eye, EyeOff, LoaderCircle, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/study-ui";
import { useStudy } from "@/components/study-provider";

export default function LoginPage() {
  const router = useRouter();
  const { session, hydrated, setUser } = useStudy();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (hydrated && session) router.replace("/dashboard"); }, [hydrated, session, router]);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email address."); return; }
    if (!password.trim()) { setError("Password is required."); return; }
    if (mode === "signup" && password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setError(""); setLoading(true);
    try {
      const response = await fetch(mode === "signin" ? "/api/auth/login" : "/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, remember }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) { setError(data.error ?? "Something went wrong. Please try again."); return; }
      setUser(data.user);
      router.push("/dashboard");
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };
  const switchMode = () => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); };
  const fillDemo = () => { setEmail("demo@studypilot.ai"); setPassword("demo1234"); setError(""); };

  if (!hydrated || session) return null;
  return <main className="auth-page">
    <section className="auth-art"><Logo /><div className="auth-copy"><p className="eyebrow">Your personal learning co-pilot</p><h1>Your smarter way to study.</h1><p>Plan better, learn faster, and turn your study goals into progress.</p><div className="benefit-list"><div className="benefit"><span>✓</span>Personalized study planning</div><div className="benefit"><span>✓</span>AI-powered learning assistance</div><div className="benefit"><span>✓</span>Smarter exam preparation</div></div></div></section>
    <section className="auth-panel"><div className="auth-card"><p className="eyebrow">{mode === "signin" ? "Welcome Kiran" : "Get started"}</p><h2>{mode === "signin" ? "Pick up where you left off." : "Create your account."}</h2><p>{mode === "signin" ? "Sign in to continue your learning journey." : "Start planning smarter study sessions."}</p><form onSubmit={submit} noValidate>{mode === "signup" && <div className="field"><label htmlFor="name">Full name</label><input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" autoComplete="name" /></div>}<div className="field"><label htmlFor="email">Email address</label><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@university.edu" autoComplete="email" /></div><div className="field"><label htmlFor="password">Password</label><div className="password-wrap"><input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete={mode === "signin" ? "current-password" : "new-password"} /><button className="icon-button" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></div>{error && <p className="field-error">{error}</p>}<div className="form-row"><label className="check"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember me</label><a className="text-link" href="#demo">Forgot password?</a></div><button className="primary-button full-button" disabled={loading}>{loading ? <LoaderCircle size={18} className="spin" /> : <ShieldCheck size={17} />}{loading ? (mode === "signin" ? "Signing in..." : "Creating account...") : (mode === "signin" ? "Sign in" : "Create account")}</button></form>{mode === "signin" && <button className="secondary-button demo-button" onClick={fillDemo}>Try Demo Account</button>}<p className="demo-note">{mode === "signin" ? "New to StudyPilot? " : "Already have an account? "}<button type="button" className="text-link" style={{ background: "none", border: 0, padding: 0, cursor: "pointer", font: "inherit" }} onClick={switchMode}>{mode === "signin" ? "Create an account" : "Sign in"}</button></p></div></section>
  </main>;
}
