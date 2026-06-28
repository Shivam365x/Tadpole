'use client';

import { useRef, KeyboardEvent, ClipboardEvent, ChangeEvent } from 'react';
import { cn } from '@/lib/utils';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  autoFocus?: boolean;
}

export function OtpInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  autoFocus = true,
}: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const setChar = (index: number, char: string) => {
    const chars = value.split('');
    chars[index] = char;
    // pad to length
    const next = Array.from({ length }, (_, i) => chars[i] ?? '').join('').slice(0, length);
    onChange(next);
  };

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const digit = e.target.value.replace(/\D/g, '').slice(-1);
    if (!digit) {
      setChar(index, '');
      return;
    }
    setChar(index, digit);
    if (index < length - 1) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (value[index]) {
        setChar(index, '');
      } else if (index > 0) {
        refs.current[index - 1]?.focus();
        setChar(index - 1, '');
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      refs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (pasted) {
      onChange(pasted.padEnd(0));
      const focusIndex = Math.min(pasted.length, length - 1);
      refs.current[focusIndex]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-between gap-2" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          autoFocus={autoFocus && i === 0}
          maxLength={1}
          disabled={disabled}
          value={value[i] ?? ''}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={cn(
            'h-12 w-full min-w-0 rounded-md border border-border bg-background text-center text-lg font-semibold text-foreground outline-none transition-colors',
            'focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/30',
            'disabled:opacity-50'
          )}
        />
      ))}
    </div>
  );
}
