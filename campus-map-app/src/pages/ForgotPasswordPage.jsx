import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { requestPasswordReset, resetPassword } from "../api/auth";
import { AuthLayout, Field, FormError, FormNotice, SubmitButton, linkClass } from "../components/AuthForm";
import { C } from "../theme";

// Two steps: (1) student ID or email; a code goes to the account's email.
// (2) The code and a new password. Afterwards every device is signed out.
export default function ForgotPasswordPage() {
  const { status } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState("request");
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  if (status === "off" || status === "signedIn") return <Navigate to="/" replace />;

  async function sendCode() {
    setBusy(true);
    setError("");
    try {
      const { message } = await requestPasswordReset(identifier.trim());
      setNotice(message);
      setStep("reset");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function onSubmitRequest(e) {
    e.preventDefault();
    if (!identifier.trim()) return setError("Enter your student ID or email.");
    sendCode();
  }

  async function onSubmitReset(e) {
    e.preventDefault();
    if (!/^\d{6}$/.test(code.trim())) return setError("Enter the 6-digit code from your email.");
    if (password.length < 8) return setError("Use at least 8 characters for your password.");
    if (password !== confirm) return setError("The passwords don't match.");
    setBusy(true);
    setError("");
    try {
      await resetPassword({ identifier: identifier.trim(), code: code.trim(), password });
      navigate("/login", { replace: true, state: { notice: "Password updated. Log in with your new password." } });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  const footer = (
    <>
      <span>Remembered your password?</span>
      <Link to="/login" className={linkClass}>
        Log in
      </Link>
    </>
  );

  if (step === "request") {
    return (
      <AuthLayout subtitle="Reset your password" footer={footer}>
        <form onSubmit={onSubmitRequest} noValidate>
          <Field
            id="identifier"
            label="Student ID or email"
            autoComplete="username"
            hint="We'll email a 6-digit code to your account's address."
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              setError("");
            }}
          />
          <FormError>{error}</FormError>
          <SubmitButton busy={busy} busyText="Sending…">
            Send code
          </SubmitButton>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout subtitle="Reset your password" footer={footer}>
      <form onSubmit={onSubmitReset} noValidate>
        <FormNotice>{notice}</FormNotice>
        <Field
          id="code"
          label="6-digit code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          onChange={(e) => {
            setCode(e.target.value.replace(/\D/g, ""));
            setError("");
          }}
        />
        <Field
          id="new-password"
          label="New password"
          type="password"
          autoComplete="new-password"
          className="mt-4 md:mt-6"
          hint="At least 8 characters. You'll be signed out on every device."
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
        />
        <Field
          id="confirm-password"
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          className="mt-4 md:mt-6"
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value);
            setError("");
          }}
        />
        <FormError>{error}</FormError>
        <SubmitButton busy={busy} busyText="Saving…">
          Save new password
        </SubmitButton>
        <div className="mt-4 md:mt-6 flex justify-between text-sm md:text-base" style={{ color: C.inkSoft }}>
          <button
            type="button"
            className={linkClass}
            onClick={() => {
              setStep("request");
              setError("");
            }}
          >
            Use a different ID
          </button>
          <button type="button" className={linkClass} disabled={busy} onClick={sendCode}>
            Send a new code
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
