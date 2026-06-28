import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useDebounce from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 400));
    expect(result.current).toBe('hello');
  });

  it('does not update the debounced value before the delay has elapsed', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 400), {
      initialProps: { val: 'first' },
    });

    rerender({ val: 'second' });
    act(() => vi.advanceTimersByTime(200));

    expect(result.current).toBe('first');
  });

  it('updates the debounced value after the full delay', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 400), {
      initialProps: { val: 'first' },
    });

    rerender({ val: 'second' });
    act(() => vi.advanceTimersByTime(400));

    expect(result.current).toBe('second');
  });

  it('resets the timer on rapid consecutive changes', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 400), {
      initialProps: { val: 'a' },
    });

    rerender({ val: 'b' });
    act(() => vi.advanceTimersByTime(200));

    rerender({ val: 'c' });
    act(() => vi.advanceTimersByTime(200));

    // Still not enough time for 'c' to settle (only 200ms since last update)
    expect(result.current).toBe('a');

    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe('c');
  });

  it('uses 400ms as the default delay', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val), {
      initialProps: { val: 'x' },
    });

    rerender({ val: 'y' });
    act(() => vi.advanceTimersByTime(399));
    expect(result.current).toBe('x');

    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe('y');
  });
});
