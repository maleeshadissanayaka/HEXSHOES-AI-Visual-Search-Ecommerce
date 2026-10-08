import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, useCart, useWishlist } from "../hooks/useStore";
export default function AccountPage() {
  const auth = useAuth(),
    cart = useCart(),
    wishlist = useWishlist();
  const [mode, setMode] = useState<"signin" | "signup">("signin"),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  if (auth.loading)
    return (
      <div className="wrap page" role="status">
        Loading account...
      </div>
    );
  if (auth.user)
    return (
      <div className="wrap page account-page">
        <span className="eyebrow">YOUR ACCOUNT</span>
        <h1>Welcome, {auth.user.displayName ?? "back"}.</h1>
        <p className="page-intro">{auth.user.email}</p>
        <div className="account-summary">
          <Link to="/wishlist">{wishlist.ids.length} saved styles</Link>
          <Link to="/cart">{cart.count} cart items</Link>
        </div>
        <p className="muted">
          Order history is not available because order persistence has not been
          implemented.
        </p>
        <button
          className="btn btn-solid"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await auth.signOut();
            } catch {
              setError("Could not sign out. Please try again.");
            } finally {
              setBusy(false);
            }
          }}
        >
          SIGN OUT
        </button>
        {error && <p role="alert">{error}</p>}
      </div>
    );
  return (
    <div className="wrap page account-page">
      <span className="eyebrow">YOUR HEXSHOES ACCOUNT</span>
      <h1>{mode === "signin" ? "Welcome back." : "Make your next move."}</h1>
      <p className="page-intro">Keep your collection close.</p>
      <div className="auth-layout">
        <form
          className="auth-form"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!auth.configured) return;
            const data = new FormData(e.currentTarget);
            setError("");
            setBusy(true);
            try {
              if (mode === "signup")
                await auth.signUp(
                  String(data.get("email")),
                  String(data.get("password")),
                  String(data.get("name")),
                );
              else
                await auth.signIn(
                  String(data.get("email")),
                  String(data.get("password")),
                );
            } catch {
              setError(
                "Authentication failed. Check your details, Firebase configuration, and enabled sign-in provider.",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          {mode === "signup" && (
            <label>
              Name
              <input name="name" autoComplete="name" required maxLength={100} />
            </label>
          )}
          <label>
            Email
            <input type="email" name="email" autoComplete="email" required />
          </label>
          <label>
            Password
            <input
              type="password"
              name="password"
              autoComplete={
                mode === "signin" ? "current-password" : "new-password"
              }
              minLength={6}
              required
            />
          </label>
          <button
            className="btn btn-solid"
            type="submit"
            disabled={!auth.configured || busy}
          >
            {mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
          </button>
          {error && <p role="alert">{error}</p>}
          <button
            className="text-link"
            type="button"
            onClick={() => {
              setError("");
              setMode(mode === "signin" ? "signup" : "signin");
            }}
          >
            {mode === "signin"
              ? "Create an account"
              : "Already have an account? Sign in"}
          </button>
        </form>
        <aside className="account-note">
          <span className="eyebrow">
            {auth.configured
              ? "FIREBASE AUTHENTICATION"
              : "CONFIGURATION PENDING"}
          </span>
          <h2>
            {auth.configured
              ? "A secure place to start."
              : "Ready for connection."}
          </h2>
          <p>
            {auth.configured
              ? "Authentication is provided by Firebase. Your wishlist and cart currently remain in this browser."
              : "UI implemented / Firebase Auth configuration pending. Sign-in and sign-up remain disabled until public web-app configuration is provided."}
          </p>
          <p>
            Admin credentials are never used in the browser. No order history is
            invented.
          </p>
        </aside>
      </div>
    </div>
  );
}
