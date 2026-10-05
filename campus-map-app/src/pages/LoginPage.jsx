import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { AuthLayout, Field, FormError, FormNotice, SubmitButton, linkClass } from "../components/AuthForm";

// Shared login for students, faculty, staff and admins: a student ID or an
// email address, plus a password. The backend decides the role.
export default function LoginPage() {
  const { status, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Back to the page that sent the user here (keeping its search state).
  const from = location.state?.from;
  const backTo = from ? from.pathname + from.search : "/";

  if (status === "off" || status === "signedIn") {
    return <Navigate to={backTo} replace state={from?.state} />;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError("Enter your student ID or email, and your password.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await login(identifier.trim(), password);
      navigate(backTo, { replace: true, state: from?.state });
    } catch (err) {
      // Same message for a wrong ID and a wrong password, so the form can't
      // be used to find out which accounts exist.
      setError(err.status === 401 ? "Wrong student ID, email, or password." : err.message);
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      subtitle="Log in to the campus map"
      footer={
        <>
          <span>New to WayGo?</span>
          <Link to="/register" className={linkClass}>
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate>
        <FormNotice>{location.state?.notice}</FormNotice>
        <Field
          id="identifier"
          label="Student ID or email"
          autoComplete="username"
          value={identifier}
          onChange={(e) => {
            setIdentifier(e.target.value);
            setError("");
          }}
        />
        <Field
          id="password"
          label="Password"
          labelAside={
            <Link to="/forgot-password" className={linkClass}>
              Forgot password?
            </Link>
          }
          type="password"
          autoComplete="current-password"
          className="mt-4 md:mt-6"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
        />
        <FormError>{error}</FormError>
        <SubmitButton busy={submitting} busyText="Logging in…">
          Log in
        </SubmitButton>
      </form>
    </AuthLayout>
  );
}
