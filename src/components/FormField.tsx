import { useId, type InputHTMLAttributes } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export function FormField({ label, value, onChange, error, ...input }: Props) {
  const id = useId();
  return (
    <label className="flex flex-col gap-1.5" htmlFor={id}>
      <span className="eyebrow text-ink-soft">{label}</span>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`h-12 rounded-2xl border bg-cream-50 px-4 text-[15px] text-ink placeholder:text-ink-soft/60 focus-visible:border-plum-500 focus-visible:outline-none ${
          error ? "border-error" : "border-cream-200"
        }`}
        {...input}
      />
      {error && (
        <span id={`${id}-error`} className="text-[13px] text-error">
          {error}
        </span>
      )}
    </label>
  );
}
