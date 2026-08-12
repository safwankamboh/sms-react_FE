import React from "react";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  type = "button",
  children,
  onClick,
  className = "",
  disabled = false,
  icon,
  style,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
}) => {
  const baseStyles =
    "rounded-md focus:outline-none flex justify-center items-center font-medium transition duration-200";

  const variants: Record<string, string> = {
    primary: "bg-gray-800 text-white hover:bg-gray-900",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline: "border border-gray-400 text-gray-700 hover:bg-gray-100",
  };

  const sizes: Record<string, string> = {
    sm: "py-1 px-3 text-xs",
    md: "py-1.5 px-4 text-sm",
    lg: "py-2 px-6 text-base",
  };

  // icon size classes
  const iconSizes: Record<string, string> = {
    sm: "text-xs", // small
    md: "text-sm", // medium
    lg: "text-base", // large
  };

  const buttonClasses = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? "w-full" : ""}
    ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}
    ${className}
  `.trim();

  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonClasses}
      disabled={disabled || loading}
      style={style}
    >
      {loading ? (
        <span
          className={`mr-2 animate-spin border-2 border-t-transparent border-white rounded-full ${iconSizes[size]}`}
        ></span>
      ) : (
        icon && <span className={`mr-2 ${iconSizes[size]}`}>{icon}</span>
      )}
      {children}
    </button>
  );
};

export default Button;
