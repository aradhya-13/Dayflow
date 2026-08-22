/**
 * Button — use this for all clickable actions.
 *
 * variants:  primary (default) | secondary | danger | ghost
 * sizes:     sm | md (default) | lg
 *
 * Props:
 *   variant, size, loading, disabled, onClick, type, className, children
 *
 * Examples:
 *   <Button onClick={save}>Save</Button>
 *   <Button variant="danger" onClick={del}>Delete</Button>
 *   <Button variant="secondary" onClick={cancel}>Cancel</Button>
 *   <Button loading={saving}>Saving…</Button>
 */

const base =
  'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

const variants = {
  primary:   'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
  secondary: 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50 focus:ring-primary-500',
  danger:    'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-600',
  ghost:     'text-neutral-600 hover:bg-neutral-100 focus:ring-primary-500',
};

const sizes = {
  sm: 'text-xs px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-5 py-2.5',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  onClick,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      )}
      {children}
    </button>
  );
}
