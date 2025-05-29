import PropTypes from "prop-types";
import { twMerge } from "tailwind-merge";

const Button = ({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  loading = false,
  className,
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition";
  const variantStyles = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500",
  };
  const disabledStyles =
    disabled || loading ? "opacity-50 cursor-not-allowed" : "";
  const loadingStyles = loading ? "flex items-center gap-2" : "";

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={twMerge(
        baseStyles,
        variantStyles[variant],
        disabledStyles,
        loadingStyles,
        className
      )}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary"]),
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  className: PropTypes.string,
};

export default Button;
