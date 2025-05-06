import React, { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


const MySwal = withReactContent(Swal);

function SignupForm({ onClose, onOpen }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const validateForm = (formData) => {
    const errors = {};
    if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormErrors({ username: '', email: '', password: '', confirmPassword: '' });

    const formData = {
      username: e.target.username.value.trim(),
      email: e.target.email.value.trim(),
      password: e.target.password.value,
    };

    const confirmPassword = e.target.confirmPassword.value;

    // Client-side validation
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsLoading(false);
      return;
    }

    if (formData.password !== confirmPassword) {
      setFormErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('https://bluecart-api.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Registration failed (${response.status})`);
      }

      const data = await response.json();
      
      await MySwal.fire({
        icon: 'success',
        title: 'Registration successful!',
        text: data.message || 'You can now log in to your account',
        timer: 2000
      });
      
      if (onClose) onClose();
      
    } catch (error) {
      console.error('Registration error:', error);
      MySwal.fire({
        icon: 'error',
        title: 'Registration failed',
        text: error.message.includes('Failed to fetch') 
          ? 'Network error. Please check your connection.' 
          : error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-modal-overlay">
      <div className="signup-form-container">
        <button className="close-button" onClick={onClose}>×</button>
        <div className="signup-form">
          <h3>Create Account</h3>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <input 
                type="text" 
                id="username" 
                name="username"
                placeholder="Username" 
                required 
                minLength="3"
                autoComplete="username"
                className={formErrors.username ? 'error' : ''}
              />
              {formErrors.username && <span className="error-message">{formErrors.username}</span>}
            </div>

            <div className="form-group">
              <input 
                type="email" 
                id="email" 
                name="email"
                placeholder="Email" 
                required 
                autoComplete="email"
                className={formErrors.email ? 'error' : ''}
              />
              {formErrors.email && <span className="error-message">{formErrors.email}</span>}
            </div>

            <div className="form-group">
              <input
                type="password"
                id="password"
                name="password"
                required
                placeholder="Enter password"
                autoComplete="new-password"
                minLength="6"
                className={formErrors.password ? 'error' : ''}
              />
              {formErrors.password && <span className="error-message">{formErrors.password}</span>}
            </div>

            <div className="form-group">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                placeholder="Confirm password"
                autoComplete="new-password"
                className={formErrors.confirmPassword ? 'error' : ''}
              />
              {formErrors.confirmPassword && (
                <span className="error-message">{formErrors.confirmPassword}</span>
              )}
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={`submit-button ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span> Processing...
                </>
              ) : (
                'Sign Up'
              )}
            </button>

            <p className="login-redirect">
              Already have an account?{' '}
              <button type="button" className="text-button" onClick={onOpen}>
                Log In
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;