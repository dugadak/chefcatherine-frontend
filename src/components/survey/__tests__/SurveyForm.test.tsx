import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SurveyForm from '../SurveyForm';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('SurveyForm', () => {
  const renderSurveyForm = () => {
    render(
      <BrowserRouter>
        <SurveyForm />
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders first step of survey form', () => {
    renderSurveyForm();
    
    expect(screen.getByText('기본 정보')).toBeInTheDocument();
    expect(screen.getByLabelText('연령대 *')).toBeInTheDocument();
    expect(screen.getByLabelText('성별')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderSurveyForm();
    
    const nextButton = screen.getByText('다음');
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText('연령대를 선택해주세요')).toBeInTheDocument();
    });
  });

  it('navigates between steps', async () => {
    renderSurveyForm();
    
    // Fill first step
    const ageSelect = screen.getByLabelText('연령대 *');
    fireEvent.change(ageSelect, { target: { value: '30-39' } });
    
    const nextButton = screen.getByText('다음');
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText('건강 정보')).toBeInTheDocument();
    });
    
    // Go back
    const prevButton = screen.getByText('이전');
    fireEvent.click(prevButton);
    
    await waitFor(() => {
      expect(screen.getByText('기본 정보')).toBeInTheDocument();
    });
  });

  it('shows progress indicator', () => {
    renderSurveyForm();
    
    expect(screen.getByText('1 / 5')).toBeInTheDocument();
  });

  it('submits survey on final step', async () => {
    renderSurveyForm();
    
    // Navigate to last step
    for (let i = 0; i < 4; i++) {
      const nextButton = screen.getByText('다음');
      fireEvent.click(nextButton);
    }
    
    await waitFor(() => {
      expect(screen.getByText('연락처 정보')).toBeInTheDocument();
    });
    
    // Fill required fields
    const emailInput = screen.getByLabelText('이메일 *');
    const nameInput = screen.getByLabelText('이름 *');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    
    // Submit
    const submitButton = screen.getByText('제출');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalled();
    });
  });

  it('handles checkbox selections', () => {
    renderSurveyForm();
    
    // Navigate to health info step
    const ageSelect = screen.getByLabelText('연령대 *');
    fireEvent.change(ageSelect, { target: { value: '30-39' } });
    
    const nextButton = screen.getByText('다음');
    fireEvent.click(nextButton);
    
    // Select health conditions
    const diabetesCheckbox = screen.getByLabelText('당뇨병');
    fireEvent.click(diabetesCheckbox);
    
    expect(diabetesCheckbox).toBeChecked();
  });

  it('shows loading state during submission', async () => {
    renderSurveyForm();
    
    // Navigate to last step
    for (let i = 0; i < 4; i++) {
      const nextButton = screen.getByText('다음');
      fireEvent.click(nextButton);
    }
    
    // Fill and submit
    const emailInput = screen.getByLabelText('이메일 *');
    const nameInput = screen.getByLabelText('이름 *');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    
    const submitButton = screen.getByText('제출');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('제출 중...')).toBeInTheDocument();
    });
  });
});