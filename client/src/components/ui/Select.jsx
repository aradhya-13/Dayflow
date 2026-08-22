/**
 * Select — dropdown with label and error state.
 *
 * Props: label, name, value, onChange, options, error, required, disabled, placeholder, className
 * options: [{ value: 'sick', label: 'Sick Leave' }, ...]
 *
 * Example:
 *   <Select
 *     label="Leave Type"
 *     name="leaveType"
 *     value={form.leaveType}
 *     onChange={handleChange}
 *     options={[
 *       { value: 'sick', label: 'Sick Leave' },
 *       { value: 'casual', label: 'Casual Leave' },
 *     ]}
 *   />
 */
export default function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  required,
  disabled,
  placeholder = 'Select…',
  className = '',
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-neutral-700">
          {label} {required && <span className="text-danger-600">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full rounded-lg border px-3 py-2 text-sm text-neutral-800
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          disabled:bg-neutral-50 disabled:cursor-not-allowed
          ${error ? 'border-danger-600 bg-danger-50' : 'border-neutral-300 bg-white'}`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-danger-600">{error}</p>}
    </div>
  );
}
