import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  isNight: boolean;
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isNight, onToggle }) => (
  <button
    type="button"
    className="theme-toggle"
    onClick={onToggle}
    aria-label={isNight ? 'Switch to warm camp mode' : 'Switch to night camp mode'}
    title={isNight ? 'Warm camp' : 'Night camp'}
  >
    {isNight ? <Sun size={15} /> : <Moon size={15} />}
  </button>
);