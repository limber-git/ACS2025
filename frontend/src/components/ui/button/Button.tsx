import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode; // Button text or content
  size?: "sm" | "md"; // Button size
  variant?: "primary" | "outline"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Additional classes
  type?: "button" | "submit" | "reset"; // Button type
  color?: "primary" | "secondary" | "warning" | "success" | "error" | "default"; // Nueva prop 'color'
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  color = "default", // Valor por defecto para color
}) => {
  // Size Classes
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  // Variant Classes (ahora dependientes del color)
  const variantClasses = {
    primary: {
      primary: "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300",
      secondary: "bg-gray-500 text-white shadow-theme-xs hover:bg-gray-600 disabled:bg-gray-300",
      warning: "bg-yellow-500 text-white shadow-theme-xs hover:bg-yellow-600 disabled:bg-yellow-300",
      success: "bg-green-500 text-white shadow-theme-xs hover:bg-green-600 disabled:bg-green-300",
      error: "bg-red-500 text-white shadow-theme-xs hover:bg-red-600 disabled:bg-red-300",
      default: "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300", // Puedes decidir un default
    },
    outline: {
      primary: "bg-white text-brand-500 ring-1 ring-inset ring-brand-300 hover:bg-brand-50 dark:bg-gray-800 dark:text-brand-400 dark:ring-brand-700 dark:hover:bg-white/[0.03] dark:hover:text-brand-300",
      secondary: "bg-white text-gray-800 ring-1 ring-inset ring-gray-300 hover:bg-gray-500 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
      warning: "bg-white text-yellow-800 ring-1 ring-inset ring-yellow-500 hover:bg-yellow-100 dark:bg-gray-800 dark:text-yellow-400 dark:ring-yellow-700 dark:hover:bg-white/[0.03] dark:hover:text-yellow-300",
      success: "bg-white text-green-800 ring-1 ring-inset ring-green-500 hover:bg-green-100 dark:bg-gray-800 dark:text-green-400 dark:ring-green-700 dark:hover:bg-white/[0.03] dark:hover:text-green-300",
      error: "bg-white text-red-500 ring-1 ring-inset ring-red-300 hover:bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:ring-red-700 dark:hover:bg-white/[0.03] dark:hover:text-red-300",
      default: "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
    },
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant][color]} ${ // Accedemos a los estilos basados en variant y color
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;