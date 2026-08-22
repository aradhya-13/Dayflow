/**
 * Badge — colored pill for status labels.
 *
 * variants: success | warning | danger | neutral | primary
 *
 * Map your statuses like this:
 *   present/approved/issued  → success
 *   pending/draft            → warning
 *   absent/rejected          → danger
 *   late/inactive            → neutral
 *
 * Example:
 *   <Badge variant="success">Approved</Badge>
 *   <Badge variant="warning">Pending</Badge>
 *   <Badge variant="danger">Rejected</Badge>
 */
const variants = {
  success: 'bg-success-50 text-success-600 ring-success-100',
  warning: 'bg-warning-50 text-warning-600 ring-warning-100',
  danger:  'bg-danger-50  text-danger-600  ring-danger-100',
  neutral: 'bg-neutral-100 text-neutral-500 ring-neutral-200',
  primary: 'bg-primary-50 text-primary-600 ring-primary-100',
};

export default function Badge({ children, variant = 'neutral', className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
