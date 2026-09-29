import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/pearl";

export const Route = createFileRoute("/portal/login")({
  head: () => ({
    meta: [
      { title: "Owner Portal sign in — PearlSmile Dental" },
      { name: "description", content: "Sign in to the PearlSmile Dental owner and reception portal." },
      { property: "og:title", content: "Owner Portal — PearlSmile Dental" },
      { property: "og:description", content: "Reception and owner portal for PearlSmile Dental." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("owner@pearlsmile.ng");
  const [pw, setPw] = useState("demo1234");
  const [forgot, setForgot] = useState(false);
  return (
    <div className="grid min-h-screen place-items-center bg-secondary/40 px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center"><Logo sub="Owner Portal" /></div>
        <form
          className="card-soft space-y-5 p-8"
          onSubmit={(e) => {
            e.preventDefault();
            sessionStorage.setItem("ps-owner", "1");
            nav({ to: "/portal" });
          }}
        >
          <h1 className="font-display text-3xl">Sign in</h1>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Email</span>
            <input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="block">
            <span className="mb-1.5 flex justify-between text-sm font-medium">
              Password
              <button type="button" onClick={() => setForgot(true)} className="font-medium text-primary">Forgot password</button>
            </span>
            <input className="field" type="password" value={pw} onChange={(e) => setPw(e.target.value)} required />
          </label>
          {forgot && <p className="rounded-xl bg-primary-soft px-3 py-2 text-sm text-primary">A reset link has been sent to {email}.</p>}
          <button className="btn-primary w-full">Sign In</button>
          <p className="text-center text-xs text-muted-foreground">Demo portal — credentials are pre-filled.</p>
        </form>
      </div>
    </div>
  );
}
