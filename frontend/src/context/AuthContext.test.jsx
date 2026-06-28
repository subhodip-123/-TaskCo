import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

vi.mock('../services/auth.service', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
  },
}));

vi.mock('../services/socket', () => ({
  getSocket: vi.fn(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    emit: vi.fn(),
  })),
}));

import { authService } from '../services/auth.service';

const Consumer = () => {
  const { user, loading, login, register, logout } = useAuth();
  return (
    <div>
      <span data-testid="user">{user ? user.name : 'null'}</span>
      <span data-testid="loading">{String(loading)}</span>
      <button
        data-testid="login-btn"
        onClick={() => login({ email: 'a@a.com', password: 'pass' })}
      >
        Login
      </button>
      <button
        data-testid="register-btn"
        onClick={() => register({ name: 'Alice', email: 'a@a.com', password: 'pass' })}
      >
        Register
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('starts with null user when localStorage has no user entry', () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );
    expect(screen.getByTestId('user').textContent).toBe('null');
  });

  it('reads the stored user from localStorage on mount', () => {
    localStorage.setItem(
      'user',
      JSON.stringify({ _id: 1, name: 'Stored Bob', email: 'bob@example.com', avatar: '' })
    );
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );
    expect(screen.getByTestId('user').textContent).toBe('Stored Bob');
  });

  it('sets user state and persists token after a successful login', async () => {
    authService.login.mockResolvedValue({
      _id: 2,
      name: 'Carol',
      email: 'carol@example.com',
      avatar: '',
      token: 'carol-token',
    });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    fireEvent.click(screen.getByTestId('login-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('Carol');
    });

    expect(localStorage.getItem('token')).toBe('carol-token');
    expect(JSON.parse(localStorage.getItem('user')).name).toBe('Carol');
  });

  it('sets user state after a successful register', async () => {
    authService.register.mockResolvedValue({
      _id: 3,
      name: 'Dave',
      email: 'dave@example.com',
      avatar: '',
      token: 'dave-token',
    });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    fireEvent.click(screen.getByTestId('register-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('Dave');
    });
  });

  it('clears user state and localStorage on logout', () => {
    localStorage.setItem('token', 'existing-token');
    localStorage.setItem(
      'user',
      JSON.stringify({ _id: 1, name: 'Eve', email: 'eve@example.com', avatar: '' })
    );

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    fireEvent.click(screen.getByTestId('logout-btn'));

    expect(screen.getByTestId('user').textContent).toBe('null');
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('exposes loading=false initially', () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );
    expect(screen.getByTestId('loading').textContent).toBe('false');
  });
});
