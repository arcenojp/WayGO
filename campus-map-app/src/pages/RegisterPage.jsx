import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { startRegistration } from "../api/auth";
import { AuthLayout, Field, FormError, FormNotice, SubmitButton, linkClass } from "../components/AuthForm";
import { C } from "../theme";

// Two steps: (1) student/employee ID, full name and email are checked against
// the allowlist and a code is emailed; (2) the code and a new password create
// the account and sign the user in.
export default function RegisterPage() {
  const { status, finishRegistration } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState("details");
  const [details, setDetails] = useState({ schoolId: "", fullName: "", email: "" });
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  if (status === "off" || status === "signedIn") return <Navigate to="/" replace />;

  const edit = (field) => (e) => {
    setDetails((d) => ({ ...d, [field]: e.target.value }));
    setError("");
  };

  async function sendCode() {
    setBusy(true);
    setError("");
    try {
      const { message } = await startRegistration({
        schoolId: details.schoolId.trim(),
        fullName: details.fullName.trim(),
        email: details.email.trim(),
      });
      setNotice(`${message} It may take a minute, and check your spam folder.`);
      setStep("verify");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function onSubmitDetails(e) {
    e.preventDefault();
    if (!details.schoolId.trim() || !details.fullName.trim() || !details.email.trim()) {
      setError("Fill in your ID, full name and email.");
      return;
    }
    sendCode();
  }

  async function onSubmitVerify(e) {
    e.preventDefault();
    if (!/^\d{6}$/.test(code.trim())) return setError("Enter the 6-digit code from your email.");
    if (password.length < 8) return setError("Use at least 8 characters for your password.");
    if (password !== confirm) return setError("The passwords don't match.");
    setBusy(true);
    setError("");
    try {
      await finishRegistration({
        schoolId: details.schoolId.trim(),
        email: details.email.trim(),
        code: code.trim(),
        password,
      });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  const footer = (
    <>
      <span>Already have an account?</span>
      <Link to="/login" className={linkClass}>
        Log in
      </Link>
    </>
  );

  if (step === "details") {
    return (
      <AuthLayout subtitle="Create your account · Step 1 of 2" footer={footer}>
        <form onSubmit={onSubmitDetails} noValidate>
          <Field id="schoolId" label="Student or employee ID" autoComplete="username" value={details.schoolId} onChange={edit("schoolId")} />
          <Field
            id="fullName"
            label="Full name"
            autoComplete="name"
            className="mt-4 md:mt-6"
            hint="As it appears in school records."
            value={details.fullName}
            onChange={edit("fullName")}
          />
          <Field
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            className="mt-4 md:mt-6"
            hint="We'll send a 6-digit code here."
            value={details.email}
            onChange={edit("email")}
          />
          <FormError>{error}</FormError>
          <SubmitButton busy={busy} busyText="Checking…">
            Send code
          </SubmitButton>
        </form>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout subtitle="Create your account · Step 2 of 2" footer={footer}>
      <form onSubmit={onSubmitVerify} noValidate>
        <FormNotice>{notice}</FormNotice>
        <p className="text-sm md:text-base mb-4 md:mb-5" style={{ color: C.inkSoft }}>
          Code sent to <strong style={{ color: C.ink }}>{details.email.trim()}</strong>.
        </p>
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
          label="Create a password"
          type="password"
          autoComplete="new-password"
          className="mt-4 md:mt-6"
          hint="At least 8 characters."
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
        />
        <Field
          id="confirm-password"
          label="Confirm password"
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
        <SubmitButton busy={busy} busyText="Creating account…">
          Create account
        </SubmitButton>
        <div className="mt-4 md:mt-6 flex justify-between text-sm md:text-base" style={{ color: C.inkSoft }}>
          <button
            type="button"
            className={linkClass}
            onClick={() => {
              setStep("details");
              setError("");
              setNotice("");
            }}
          >
            Change details
          </button>
          <button type="button" className={linkClass} disabled={busy} onClick={sendCode}>
            Send a new code
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
