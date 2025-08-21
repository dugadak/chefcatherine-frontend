import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../authStore';

describe('authStore', () => {
  beforeEach(() => {
    // Reset store before each test
    localStorage.clear();
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false
    });
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useAuthStore());
    
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('handles successful login', async () => {
    const { result } = renderHook(() => useAuthStore());
    
    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.token).toBeTruthy();
    expect(localStorage.getItem('token')).toBeTruthy();
  });

  it('handles logout', () => {
    const { result } = renderHook(() => useAuthStore());
    
    // Set initial authenticated state
    act(() => {
      useAuthStore.setState({
        user: { id: '1', email: 'test@example.com', name: 'Test' },
        token: 'test-token',
        isAuthenticated: true
      });
      localStorage.setItem('token', 'test-token');
    });
    
    // Logout
    act(() => {
      result.current.logout();
    });
    
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('updates user profile', () => {
    const { result } = renderHook(() => useAuthStore());
    
    // Set initial user
    act(() => {
      useAuthStore.setState({
        user: { id: '1', email: 'test@example.com', name: 'Test' }
      });
    });
    
    // Update profile
    act(() => {
      result.current.updateProfile({ name: 'Updated Name', age: 30 });
    });
    
    expect(result.current.user?.name).toBe('Updated Name');
    expect(result.current.user?.age).toBe(30);
  });

  it('persists authentication state', () => {
    const { result, rerender } = renderHook(() => useAuthStore());
    
    // Login
    act(() => {
      useAuthStore.setState({
        user: { id: '1', email: 'test@example.com', name: 'Test' },
        token: 'test-token',
        isAuthenticated: true
      });
    });
    
    // Simulate page reload
    rerender();
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.token).toBe('test-token');
  });
});