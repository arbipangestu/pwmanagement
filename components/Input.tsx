interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input({ label, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label className="text-sm font-medium text-secondary">{label}</label>
      <input
        className={`px-4 py-2 rounded-md border border-secondary-charcoal/30 focus:outline-none focus:ring-1 focus:ring-primary-accent focus:border-primary-accent transition-all ${className}`}
        {...props}
      />
    </div>
  );
}
