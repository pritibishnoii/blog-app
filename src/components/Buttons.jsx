'use client';

export function PrimaryButton({ children, className = '', disabled, ...props }) {
  return (
    <button
      disabled={disabled}
      className={`px-5 py-2.5 rounded-lg bg-primary text-white font-medium hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50 disabled:pointer-events-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, className = '', disabled, ...props }) {
  return (
    <button
      disabled={disabled}
      className={`px-5 py-2.5 rounded-lg border border-white/15 text-gray-200 font-medium hover:bg-white/5 active:scale-[0.98] transition disabled:opacity-50 disabled:pointer-events-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
