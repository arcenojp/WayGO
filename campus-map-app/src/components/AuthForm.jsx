import { C } from "../theme";

// Shared pieces for the login, registration and password-reset pages. They
// scale up on larger screens so the form doesn't look like a phone layout.

export function AuthLayout({ subtitle, children, footer }) {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 py-10"
      style={{ background: C.paper, color: C.ink, fontFamily: "'IBM Plex Sans', sans-serif", borderTop: `3px solid ${C.brand}` }}
    >
      <main className="w-full max-w-sm md:max-w-md lg:max-w-lg">
        <div className="flex flex-col items-center mb-6 md:mb-8">
          <img src="/WayGo-logo.svg" alt="" className="w-14 h-14 md:w-20 md:h-20 mb-2 md:mb-3" />
          <h1 className="text-2xl md:text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: C.brandDark }}>
            WayGo
          </h1>
          <p className="text-sm md:text-lg text-center mt-0.5 md:mt-1" style={{ color: C.inkSoft }}>
            {subtitle}
          </p>
        </div>
        <div className="rounded-lg md:rounded-xl border p-5 sm:p-6 md:p-8 lg:p-10 shadow-sm" style={{ background: "#FFFFFF", borderColor: C.line }}>
          {children}
          {footer && (
            <div
              className="mt-5 md:mt-7 pt-4 md:pt-6 border-t flex flex-wrap justify-center gap-x-1.5 gap-y-1 text-sm md:text-base"
              style={{ borderColor: C.line, color: C.inkSoft }}
            >
              {footer}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// labelAside: a link shown at the end of the label row (e.g. "Forgot password?").
export function Field({ id, label, labelAside, hint, className = "", ...input }) {
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-3 mb-1.5 md:mb-2">
        <label htmlFor={id} className="text-sm md:text-base font-medium">
          {label}
        </label>
        {labelAside && <span className="text-sm md:text-base">{labelAside}</span>}
      </div>
      <input
        id={id}
        {...input}
        className="w-full rounded-md md:rounded-lg border px-3 py-2.5 md:px-4 md:py-3 text-base md:text-lg outline-none waygo-input"
        style={{ borderColor: C.line, background: "#FFFFFF", color: C.ink }}
      />
      {hint && (
        <p className="text-xs md:text-sm mt-1 md:mt-1.5" style={{ color: C.inkSoft }}>
          {hint}
        </p>
      )}
    </div>
  );
}

export function FormError({ children }) {
  if (!children) return null;
  return (
    <p role="alert" className="text-sm md:text-base mt-3" style={{ color: "#B42318" }}>
      {children}
    </p>
  );
}

export function FormNotice({ children }) {
  if (!children) return null;
  return (
    <p role="status" className="text-sm md:text-base rounded-md px-3 py-2 md:px-4 md:py-3 mb-4 md:mb-5" style={{ background: C.brandTint, color: C.brandDark }}>
      {children}
    </p>
  );
}

export function SubmitButton({ busy, busyText, children }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="w-full mt-5 md:mt-7 rounded-md md:rounded-lg py-2.5 md:py-3.5 text-base md:text-lg font-semibold text-white transition-opacity disabled:opacity-60"
      style={{ background: C.brand }}
    >
      {busy ? busyText : children}
    </button>
  );
}

// Magenta text links and text buttons (styles in index.css).
export const linkClass = "waygo-link font-semibold underline-offset-4 rounded-sm";
