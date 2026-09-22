import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ThemeProvider } from './ThemeProvider';
import { ThemeToggle } from '../components/ui/ThemeToggle';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
  document.documentElement.classList.remove('dark');
});

describe('ThemeProvider', () => {
  it('synchronizes all toggles and persists the selected theme', () => {
    render(<ThemeProvider><ThemeToggle /><ThemeToggle /></ThemeProvider>);
    fireEvent.click(screen.getAllByRole('button', { name: 'Switch to dark theme' })[0]);
    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem('eventx_theme')).toBe('dark');
    expect(screen.getAllByRole('button', { name: 'Switch to light theme' })).toHaveLength(2);
    fireEvent.click(screen.getAllByRole('button', { name: 'Switch to light theme' })[1]);
    expect(document.documentElement).not.toHaveClass('dark');
    expect(localStorage.getItem('eventx_theme')).toBe('light');
  });

  it('restores the saved preference without requiring the public navbar', () => {
    localStorage.setItem('eventx_theme', 'dark');
    const view = render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
    expect(document.documentElement).toHaveClass('dark');
    fireEvent.click(screen.getByRole('button', { name: 'Switch to light theme' }));
    view.unmount();
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
    expect(screen.getByRole('button', { name: 'Switch to dark theme' })).toBeInTheDocument();
    expect(document.documentElement).not.toHaveClass('dark');
  });

  it('follows preference changes from another tab', () => {
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
    localStorage.setItem('eventx_theme', 'dark');
    fireEvent(window, new window.StorageEvent('storage', { key: 'eventx_theme', newValue: 'dark' }));
    expect(document.documentElement).toHaveClass('dark');
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
  });

  it('still switches when browser storage is unavailable', () => {
    vi.spyOn(window.Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Blocked'); });
    vi.spyOn(window.Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Blocked'); });
    render(<ThemeProvider><ThemeToggle /></ThemeProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark theme' }));
    expect(document.documentElement).toHaveClass('dark');
  });
});
