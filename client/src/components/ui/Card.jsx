/**
 * Card — white container with consistent padding and shadow.
 *
 * Props:
 *   title (optional header text)
 *   action (optional JSX in the header right side, e.g. a Button)
 *   padding: true (default) | false (for full-bleed content like tables)
 *   className
 *
 * Examples:
 *   <Card title="Employee List" action={<Button size="sm">Add</Button>}>
 *     ...content
 *   </Card>
 *
 *   <Card padding={false}>
 *     <Table ... />
 *   </Card>
 */
export default function Card({ title, action, children, padding = true, className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow-card border border-neutral-200 overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          {title && <h3 className="text-sm font-semibold text-neutral-700">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={padding ? 'p-5' : ''}>{children}</div>
    </div>
  );
}
