import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'; 
import AuthProvider from 'react-auth-kit'; 
import { store } from '../assets/store'; 
import SignInPage from '../pages/SignInPage.jsx'; 
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Unauthorized from '../pages/Unauthorized.jsx';
const queryClient = new QueryClient();


const renderWithAuthAndRouter = (ui) => {
  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider store={store}>
          {ui}
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('SignIn Component', () => {

  test('renders Sign up title', () => {
    renderWithAuthAndRouter(<Unauthorized />);
    const title = screen.getByTestId("unauthTitle");
    expect(title).toBeInTheDocument();
  });


  test('renders Sign In title', () => {
    renderWithAuthAndRouter(<SignInPage />);
    const title = screen.getByTestId("signInTitle");
    expect(title).toBeInTheDocument();
  });

  test('shows errors if required fields are empty on submit', () => {
    renderWithAuthAndRouter(<SignInPage />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.click(submitButton);

    const emailError = screen.getByText(/Email is required/i);
    const passwordError = screen.getByText(/Password is required/i);

    expect(emailError).toBeInTheDocument();
    expect(passwordError).toBeInTheDocument();
  });

  test('shows error if invalid email format is entered', () => {
    renderWithAuthAndRouter(<SignInPage />);

    const emailInput = screen.getByLabelText(/Email/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    const invalidEmailError = screen.getByText(/Invalid email format/i);
    expect(invalidEmailError).toBeInTheDocument();
  });

  test('successful sign-in redirects user on valid credentials', async () => {
    renderWithAuthAndRouter(<SignInPage />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'a@b.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Dog123@' } });
  });
});
