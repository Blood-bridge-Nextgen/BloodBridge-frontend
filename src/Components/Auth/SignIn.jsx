import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import "./AuthStyle.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTrack } from "@watchupltd/react";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import logoSymbol from "../../assets/logo-symbol.png";
import { signInUser } from "../../helpers/auth";
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

const SignIn = ({
  // onSubmit = noop,
  onForgotPassword = noop,
  onCreateAccount = noop,
}) => {
  const track = useTrack();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: zodResolver(SignInSchema),
  });
  const { mutate, isPending } = useMutation({
    mutationFn: signInUser,
    onSuccess(data) {
      toast.success("Signed in successfully! Redirecting to your dashboard...");
      track("user.signed_in", {
        email: data.data.profile.email,
        role: data.data.profile.role,
      });
      Cookies.set("authToken", data.data.token, { expires: 7 });

      if (!data.data.profile.emailVerifiedAt) {
        navigate("/verify-otp");
        return;
      }

      navigate(
        data.data.profile.role === "facility"
          ? "/HospitalDashboard"
          : "/DonorDashboard",
      );
    },
    onError(err) {
      toast.error(errorParser(err));
    },
  });

  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const onFormSubmit = handleSubmit((data) => {
    mutate(data);
  });

  return (
    <main className="sign-in">
      <section className="sign-in__card" aria-label="Sign in to BloodBridge">
        <div className="sign-in__brand" aria-label="BloodBridge secured">
          <span className="sign-in__logo-mark" aria-hidden="true">
            <img src={logoSymbol} alt="" />
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
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="john.doe@example.com"
                aria-invalid={Boolean(errors.email?.message)}
                aria-describedby={
                  errors.email?.message ? "sign-in-email-error" : undefined
                }
              />
            </Field>

            <Field
              id="sign-in-password"
              label="Password"
              error={errors.password?.message}
            >
              <input
                {...register("password")}
                id="sign-in-password"
                name="password"
                type={passwordVisible ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                aria-invalid={Boolean(errors.password?.message)}
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
            <label
              className="sign-in__remember-label"
              htmlFor="sign-in-remember"
            >
              <input id="sign-in-remember" type="checkbox" />
              <span>Remember Me</span>
            </label>
            <button
              className="sign-in__forgot-link"
              type="button"
              onClick={() => {
                onForgotPassword();
                navigate("/ResetPassword");
              }}
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
          <button
            type="button"
            onClick={() => {
              onCreateAccount();
              navigate("/OnboardingScreen");
            }}
          >
            Create Account
          </button>
        </p>
      </section>
    </main>
  );
};

const SignInRoute = () => {
  const navigate = useNavigate();

  return (
    <SignIn
      onForgotPassword={() => navigate("/ResetPassword")}
      onCreateAccount={() => navigate("/OnboardingScreen")}
    />
  );
};

export { SignIn, SignInRoute };
