import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { createElement } from 'react';
import { ThemeProvider, useTheme } from './ThemeContext';

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(ThemeProvider, {}, children);

describe('ThemeContext', () => {
  describe('useTheme hook', () => {
    test('should return theme object with required properties', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current).toHaveProperty('theme');
      expect(result.current).toHaveProperty('toggleTheme');
    });

    test('theme should be a string', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(typeof result.current.theme).toBe('string');
    });

    test('theme should be either dark or light', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(['dark', 'light']).toContain(result.current.theme);
    });

    test('toggleTheme should be a function', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(typeof result.current.toggleTheme).toBe('function');
    });

    test('toggleTheme should change theme state', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      const initialValue = result.current.theme;

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).not.toBe(initialValue);
    });

    test('toggleTheme can be called multiple times', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      const initialValue = result.current.theme;

      act(() => {
        result.current.toggleTheme();
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe(initialValue);
    });

    test('multiple hook instances within same provider share state', () => {
      const { result: result1 } = renderHook(() => useTheme(), {
        wrapper,
      });
      const { result: result2 } = renderHook(() => useTheme(), {
        wrapper,
      });

      expect(result1.current.theme).toBe(result2.current.theme);
      expect(result1.current.theme).toBe('dark');
    });

    test('should throw error when used outside provider', () => {
      expect(() => {
        renderHook(() => useTheme());
      }).toThrow('useTheme must be used inside ThemeProvider');
    });

    test('theme state persists across re-renders', () => {
      const { result, rerender } = renderHook(() => useTheme(), {
        wrapper,
      });

      const initialValue = result.current.theme;

      act(() => {
        result.current.toggleTheme();
      });

      rerender();

      expect(result.current.theme).not.toBe(initialValue);
    });

    test('toggleTheme returns undefined', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      let returnValue;
      act(() => {
        returnValue = result.current.toggleTheme();
      });

      expect(returnValue).toBeUndefined();
    });
  });

  describe('ThemeProvider', () => {
    test('provides initial theme state', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      expect(result.current.theme).toBeDefined();
    });

    test('theme state can be toggled through provider', () => {
      const { result } = renderHook(() => useTheme(), { wrapper });

      const initial = result.current.theme;

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).not.toBe(initial);
    });
  });
});
