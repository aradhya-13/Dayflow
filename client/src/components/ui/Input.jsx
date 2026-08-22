/**
 * Input — form text field with label and error state.
 *
 * Props: label, name, type, value, onChange, placeholder, error, required, disabled, className
 *
 * Example:
 *   <Input
 *     label="Email"
 *     name="email"
 *     type="email"
 *     value={form.email}
 *     onChange={handleChange}
 *     error={errors.email}
 *   />
 */
export default function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required,
  disabled,
  className = '',
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-neutral-700">
          {label} {required && <span className="text-danger-600">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full rounded-lg border px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed
          ${error ? 'border-danger-600 bg-danger-50' : 'border-neutral-300 bg-white'}`}
      />
      {error && <p className="text-xs text-danger-600">{error}</p>}
    </div>
  );
}
