import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../LoginForm';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('LoginForm', () => {
  const renderLoginForm = () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders login form', () => {
    renderLoginForm();
    
    expect(screen.getByText('로그인')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('이메일 주소')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('비밀번호')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();
  });

  it('shows validation error for empty fields', async () => {
    renderLoginForm();
    
    const submitButton = screen.getByRole('button', { name: '로그인' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      const emailInput = screen.getByPlaceholderText('이메일 주소') as HTMLInputElement;
      expect(emailInput.validity.valueMissing).toBe(true);
    });
  });

  it('handles successful login', async () => {
    renderLoginForm();
    
    const emailInput = screen.getByPlaceholderText('이메일 주소');
    const passwordInput = screen.getByPlaceholderText('비밀번호');
    const submitButton = screen.getByRole('button', { name: '로그인' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('displays error message on login failure', async () => {
    renderLoginForm();
    
    const emailInput = screen.getByPlaceholderText('이메일 주소');
    const passwordInput = screen.getByPlaceholderText('비밀번호');
    const submitButton = screen.getByRole('button', { name: '로그인' });
    
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    
    // Mock login failure
    const mockLogin = vi.fn().mockRejectedValue({
      response: { data: { message: '로그인 실패' } }
    });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.queryByText(/로그인에 실패했습니다/)).toBeInTheDocument();
    });
  });

  it('shows loading state during login', async () => {
    renderLoginForm();
    
    const emailInput = screen.getByPlaceholderText('이메일 주소');
    const passwordInput = screen.getByPlaceholderText('비밀번호');
    const submitButton = screen.getByRole('button', { name: '로그인' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('로그인 중...')).toBeInTheDocument();
    });
  });

  it('has link to register page', () => {
    renderLoginForm();
    
    const registerLink = screen.getByText('새 계정 만들기');
    expect(registerLink).toBeInTheDocument();
    expect(registerLink.getAttribute('href')).toBe('/register');
  });
});