interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export default function Button({ children, variant = 'primary', isLoading, className, ...props }: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded-2xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-primary text-highlight-white shadow-md hover:bg-primary-dark hover:shadow-lg hover:shadow-primary-accent/50 focus:outline-none focus:ring-2 focus:ring-primary-accent",
    secondary: "bg-secondary text-highlight-white border border-secondary-charcoal hover:bg-secondary-charcoal focus:outline-none focus:ring-2 focus:ring-primary-accent",
    danger: "bg-primary-accent text-highlight-white hover:bg-primary-dark shadow-md hover:shadow-lg hover:shadow-primary-accent/50 focus:outline-none focus:ring-2 focus:ring-primary-accent",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <span className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" /> : children}
    </button>
  );
}
