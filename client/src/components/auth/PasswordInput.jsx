import { useState } from 'react';
import { Eye, EyeSlash, Lock } from '@phosphor-icons/react';
import { Input } from '../ui/Input';

export function PasswordInput({ label = 'Password', ...props }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Input
      {...props}
      label={label}
      type={isVisible ? 'text' : 'password'}
      icon={Lock}
      tone="dark"
      endAdornment={
        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          className="focus-ring grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-white/[0.07] hover:text-teal-200"
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          aria-pressed={isVisible}
        >
          {isVisible ? (
            <EyeSlash weight="regular" aria-hidden="true" className="h-4.5 w-4.5" />
          ) : (
            <Eye weight="regular" aria-hidden="true" className="h-4.5 w-4.5" />
          )}
        </button>
      }
    />
  );
}
