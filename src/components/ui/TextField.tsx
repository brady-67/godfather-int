interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  hint?: string;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  autoComplete,
  placeholder,
  rows,
  maxLength,
  hint,
}: TextFieldProps) {
  const control = rows ? (
    <textarea
      id={id}
      rows={rows}
      value={value}
      required={required}
      placeholder={placeholder}
      maxLength={maxLength}
      onChange={(event) => onChange(event.target.value)}
      className="field resize-y"
    />
  ) : (
    <input
      id={id}
      type={type}
      value={value}
      required={required}
      autoComplete={autoComplete}
      placeholder={placeholder}
      maxLength={maxLength}
      onChange={(event) => onChange(event.target.value)}
      className="field"
    />
  );

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-ink-700">
        {label}
        {required && <span className="text-gold-700"> *</span>}
      </label>
      {control}
      {hint && <p className="text-xs text-ink-400">{hint}</p>}
    </div>
  );
}
