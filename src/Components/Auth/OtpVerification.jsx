import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { sendPasswordReset, verifyPasswordResetOtp } from "../../api/authApi";
// import { useCountdown } from "../../hooks/useCountdown";
import "./OtpVerification.css";
import { useAuth } from "../../hooks/auth";

const DEFAULT_CODE_LENGTH = 6;
const DEFAULT_EXPIRES_IN_MINUTES = 10;
const RESEND_COOLDOWN_SECONDS = 60;

const getInitialCode = (length) => Array.from({ length }, () => "");

const getMaskedEmail = (email) => {
  const [name, domain] = email.split("@");

  if (!name || !domain) {
    return email;
  }

  return `${name.charAt(0)}***@${domain}`;
};

const isDigit = (value) => /^\d$/.test(value);

export default function OtpVerification({
  onVerified,
  onBack = () => window.history.back(),
  onChangeEmail,
  onBackToSignIn,
  codeLength = DEFAULT_CODE_LENGTH,
  expiresInMinutes = DEFAULT_EXPIRES_IN_MINUTES,
}) {
  const user = useAuth();
  const email = user.data?.email;
  const [code, setCode] = useState(() => getInitialCode(codeLength));
  const [errorMessage, setErrorMessage] = useState("");
  const [resendError, setResendError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef([]);
  const submittedCodeRef = useRef("");

  // const { secondsLeft, restart } = useCountdown(RESEND_COOLDOWN_SECONDS);

  const maskedEmail = useMemo(() => getMaskedEmail(email), [email]);

  const enteredCode = code.join("");
  const isCodeComplete = code.every((digit) => digit !== "");

  useEffect(() => {
    if (!email && typeof onChangeEmail === "function") {
      onChangeEmail();
    }
  }, [email, onChangeEmail]);

  useEffect(() => {
    if (!email) return;

    const timer = window.setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [email]);

  useEffect(() => {
    if (!isCodeComplete || isVerifying || !email) {
      return;
    }

    if (submittedCodeRef.current === enteredCode) {
      return;
    }

    handleVerify(enteredCode);
  }, [enteredCode, isCodeComplete, isVerifying, email]);

  if (!email) {
    return null;
  }

  const focusInput = (index) => {
    const input = inputRefs.current[index];

    if (!input) return;

    input.focus();
    input.select();
  };

  const clearMessages = () => {
    setErrorMessage("");
    setResendError("");
    setStatusMessage("");
  };

  const updateCode = (nextCode) => {
    setCode(nextCode);
    setErrorMessage("");
    setResendError("");
  };

  const fillCode = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, codeLength);

    if (!digits) {
      return;
    }

    const nextCode = getInitialCode(codeLength);

    digits.split("").forEach((digit, index) => {
      nextCode[index] = digit;
    });

    submittedCodeRef.current = "";
    updateCode(nextCode);

    const lastIndex = Math.min(digits.length, codeLength) - 1;

    window.setTimeout(() => {
      focusInput(lastIndex);
    }, 0);
  };

  const handleChange = (index, value) => {
    clearMessages();

    const digits = value.replace(/\D/g, "");

    if (digits.length > 1) {
      fillCode(digits);
      return;
    }

    const nextCode = [...code];
    nextCode[index] = digits;

    submittedCodeRef.current = "";
    updateCode(nextCode);

    if (digits && index < codeLength - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();

      if (index > 0) {
        focusInput(index - 1);
      }

      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();

      if (index < codeLength - 1) {
        focusInput(index + 1);
      }

      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusInput(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      focusInput(codeLength - 1);
      return;
    }

    if (event.key === "Backspace" && code[index] === "" && index > 0) {
      event.preventDefault();

      const nextCode = [...code];
      nextCode[index - 1] = "";

      submittedCodeRef.current = "";
      updateCode(nextCode);
      focusInput(index - 1);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const pastedValue = event.clipboardData?.getData("text") || "";
    fillCode(pastedValue);
  };

  async function handleVerify(codeToVerify = enteredCode) {
    if (
      !email ||
      isVerifying ||
      codeToVerify.length !== codeLength ||
      !/^\d+$/.test(codeToVerify)
    ) {
      return;
    }

    if (submittedCodeRef.current === codeToVerify) {
      return;
    }

    submittedCodeRef.current = codeToVerify;
    setIsVerifying(true);
    setErrorMessage("");
    setResendError("");
    setStatusMessage("");

    try {
      const resetToken = await verifyPasswordResetOtp(email, codeToVerify);

      if (!resetToken) {
        throw new Error("That code is incorrect or has expired.");
      }

      onVerified(resetToken);
    } catch (error) {
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : "That code is incorrect or has expired.",
      );

      const clearedCode = getInitialCode(codeLength);
      setCode(clearedCode);

      window.setTimeout(() => {
        focusInput(0);
      }, 0);
    } finally {
      setIsVerifying(false);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isCodeComplete || isVerifying) {
      return;
    }

    handleVerify(enteredCode);
  };
  const handleResend = async () => {
    //   const { secondsLeft, restart } = useCountdown(RESEND_COOLDOWN_SECONDS);

    //   if (secondsLeft > 0 || isResending || isVerifying) {
    //     return;
    //   }

    //   setIsResending(true);
    //   setErrorMessage("");
    setResendError("");
    setStatusMessage("");

    try {
      await sendPasswordReset(email);

      submittedCodeRef.current = "";
      setCode(getInitialCode(codeLength));
      // restart(RESEND_COOLDOWN_SECONDS);

      setStatusMessage("A new code has been sent.");

      window.setTimeout(() => {
        focusInput(0);
      }, 0);
    } catch (error) {
      setResendError(
        error instanceof Error && error.message
          ? error.message
          : "Unable to resend the code. Please try again.",
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleDifferentEmail = () => {
    if (typeof onChangeEmail === "function") {
      onChangeEmail();
    }
  };

  const handleBackToSignIn = () => {
    if (typeof onBackToSignIn === "function") {
      onBackToSignIn();
    }
  };

  const formatCountdown = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  return (
    <main className="otp-verification">
      <section className="otp-verification__card">
        <header className="otp-verification__header">
          <button
            type="button"
            className="otp-verification__back-button"
            aria-label="Go back"
            onClick={onBack}
            disabled={isVerifying}
          >
            <ArrowLeft size={18} aria-hidden="true" />
          </button>

          <h1 className="otp-verification__title">Verify Code</h1>
        </header>

        <div className="otp-verification__intro">
          <p>
            We sent a {codeLength}-digit code to <strong>{maskedEmail}</strong>.
            Enter it below to continue. The code expires in {expiresInMinutes}{" "}
            minutes.
          </p>
        </div>

        <form
          className="otp-verification__form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="otp-verification__field">
            <label className="otp-verification__label">Verification Code</label>

            <div
              className={`otp-verification__code-group${
                errorMessage ? " otp-verification__code-group--error" : ""
              }`}
              role="group"
              aria-label={`${codeLength}-digit verification code`}
            >
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  className={`otp-verification__code-input${
                    errorMessage ? " otp-verification__code-input--error" : ""
                  }`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  value={digit}
                  aria-label={`Digit ${index + 1} of ${codeLength}`}
                  aria-invalid={Boolean(errorMessage)}
                  onChange={(event) => handleChange(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  onPaste={handlePaste}
                  onFocus={(event) => event.target.select()}
                  disabled={isVerifying || isResending}
                />
              ))}
            </div>

            {errorMessage && (
              <div
                className="otp-verification__error"
                role="alert"
                aria-live="assertive"
              >
                <AlertCircle size={14} aria-hidden="true" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="otp-verification__submit-button"
            disabled={!isCodeComplete || isVerifying || isResending}
          >
            {isVerifying ? (
              <>
                <Loader2
                  className="otp-verification__spinner"
                  size={17}
                  aria-hidden="true"
                />
                <span>Verifying...</span>
              </>
            ) : (
              "Verify Code"
            )}
          </button>
        </form>

        <div className="otp-verification__resend">
          {/* {secondsLeft > 0 ? (
            <p className="otp-verification__resend-text otp-verification__resend-text--cooldown">
              Resend code in {formatCountdown(secondsLeft)}
            </p>
          ) : ( */}
          <p className="otp-verification__resend-text">
            Didn't get the code?{" "}
            <button
              type="button"
              className="otp-verification__resend-button"
              onClick={handleResend}
              disabled={isResending || isVerifying}
            >
              {isResending ? "Sending..." : "Resend"}
            </button>
          </p>
          {/* )} */}

          {statusMessage && (
            <div
              className="otp-verification__status"
              role="status"
              aria-live="polite"
            >
              <MailCheck size={14} aria-hidden="true" />
              <span>{statusMessage}</span>
            </div>
          )}

          {resendError && (
            <div
              className="otp-verification__resend-error"
              role="alert"
              aria-live="assertive"
            >
              <AlertCircle size={14} aria-hidden="true" />
              <span>{resendError}</span>
            </div>
          )}
        </div>

        <nav className="otp-verification__links">
          <button
            type="button"
            className="otp-verification__link"
            onClick={handleDifferentEmail}
            disabled={isVerifying || isResending}
          >
            Use a different email
          </button>

          <button
            type="button"
            className="otp-verification__link"
            onClick={handleBackToSignIn}
            disabled={isVerifying || isResending}
          >
            Back to Sign In
          </button>
        </nav>
      </section>
    </main>
  );
}
