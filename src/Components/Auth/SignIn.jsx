import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import "./AuthStyle.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { signIn } from "../../helpers/auth";
import { errorParser } from "../../lib/utils";
import { SignInSchema } from "../../schema/auth";

const noop = () => {};

const Field = ({ id, label, error, children }) => (
  <div className="sign-in__field">
    <label className="sign-in__label" htmlFor={id}>
      {label}
    </label>
    <div
      className={`sign-in__control${error ? " sign-in__control--error" : ""}`}
    >
      {children}
    </div>
    {error && (
      <p className="sign-in__field-error" id={`${id}-error`} role="alert">
        {error}
      </p>
    )}
  </div>
);

const SignIn = ({ onForgotPassword = noop, onCreateAccount = noop }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignInSchema),
  });
  const { isPending, mutate } = useMutation({
    mutationFn: signIn,
    onSuccess(data) {
      toast.success("Signed in successfully!");
      console.log(data);
    },
    onError(err) {
      toast.error(errorParser(err));
    },
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const onFormSubmit = handleSubmit((data) => {
    mutate(data);
  });

  return (
    <main className="sign-in">
      <section className="sign-in__card" ariaLabel="Sign in to BloodBridge">
        <div className="sign-in__brand" ariaLabel="BloodBridge secured">
          <span className="sign-in__logo-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" title="Logo" fill="none">
              <path
                d="M12 3.5 5.5 10a6.5 6.5 0 1 0 13 0L12 3.5Z"
                fill="currentColor"
              />
              <path
                d="M8.5 12.5c.7 1.1 1.8 1.7 3.5 1.7s2.8-.6 3.5-1.7"
                stroke="#B91C1C"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="sign-in__wordmark">
            <span>Blood</span>
            <span>Bridge</span>
          </span>
          <span className="sign-in__secured">SECURED</span>
        </div>

        <h1 className="sign-in__title">Sign In</h1>

        <form className="sign-in__form" noValidate onSubmit={onFormSubmit}>
          <div className="sign-in__fields">
            <Field
              id="sign-in-email"
              label="Email Address"
              error={errors.email?.message}
            >
              <input
                {...register("email")}
                id="sign-in-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="john.doe@example.com"
                aria-invalid={Boolean(errors.email?.message)}
                aria-describedby={
                  errors.email ? "sign-in-email-error" : undefined
                }
              />
            </Field>

            <Field
              id="sign-in-password"
              label="Password"
              error={errors.password}
            >
              <input
                {...register("password")}
                id="sign-in-password"
                name="password"
                type={passwordVisible ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password?.message
                    ? "sign-in-password-error"
                    : undefined
                }
              />
              <button
                className="sign-in__password-toggle"
                type="button"
                aria-label={passwordVisible ? "Hide password" : "Show password"}
                onClick={() => setPasswordVisible((visible) => !visible)}
              >
                {passwordVisible ? (
                  <Eye aria-hidden="true" />
                ) : (
                  <EyeOff aria-hidden="true" />
                )}
              </button>
            </Field>
          </div>

          <div className="sign-in__options-row">
            {/* <label
              className="sign-in__remember-label"
              htmlFor="sign-in-remember"
            >
              <input
                id="sign-in-remember"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(event) =>
                  updateField("rememberMe", event.target.checked)
                }
              />
              <span>Remember Me</span>
            </label> */}
            <button
              className="sign-in__forgot-link"
              type="button"
              onClick={onForgotPassword}
            >
              Forgot Password?
            </button>
          </div>

          <button
            className="sign-in__submit"
            type="submit"
            disabled={isPending}
          >
            {isPending && (
              <Loader2 className="sign-in__loader" aria-hidden="true" />
            )}
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="sign-in__create-account">
          Don't have an account?{" "}
          <Link to="/CreateDonorProfile">Create Account</Link>
        </p>
      </section>
    </main>
  );
};

export default SignIn;
