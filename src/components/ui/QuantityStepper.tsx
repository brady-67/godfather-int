import { Minus, Plus } from 'lucide-react';

interface QuantityStepperProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
}

export function QuantityStepper({ value, max, onChange, label }: QuantityStepperProps) {
  const canDecrease = value > 1;
  const canIncrease = value < max;

  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex items-center overflow-hidden rounded-full border border-ink-200 bg-white"
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={!canDecrease}
        aria-label="Decrease quantity"
        className="p-2.5 text-ink-700 transition hover:bg-gold-50 disabled:cursor-not-allowed disabled:text-ink-300"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-10 text-center text-sm font-semibold tabular-nums text-ink-900" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={!canIncrease}
        aria-label="Increase quantity"
        className="p-2.5 text-ink-700 transition hover:bg-gold-50 disabled:cursor-not-allowed disabled:text-ink-300"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
