import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useSignIn } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';

function LoginForm({ onClose, onOpen }) {
  const signIn = useSignIn();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const toggleForm = () => {
    setIsOpen(!isOpen);
    if (onClose) {
      onClose();
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      email,
      password,
    };

    try {
      const response = await fetch('https://bluecart-api.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.status === 200) {
        try {
          const data = await response.json();

          if (data.access_token) {
            localStorage.setItem('access_token', data.access_token);

            signIn({
              token: data.access_token,
              expiresIn: 1800,
              tokenType: 'Bearer',
            });

            Swal.fire({
              icon: 'success',
              title: 'Login Successful',
              text: 'You have successfully logged in.',
            });

            // Close the card upon successful login
            toggleForm();

            navigate('/');
          } else {
            console.error('Invalid token in the response data:', data);
            Swal.fire({
              icon: 'error',
              title: 'Login Failed',
              text: 'Invalid response data. Please try again.',
            });
          }
        } catch (jsonError) {
          console.error('JSON parsing error:', jsonError);
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Invalid response data. Please try again.',
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Invalid email or password. Please try again.',
        });
      }
    } catch (error) {
      console.error('Login Error:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred during login. Please try again later.',
      });
    }
  };

  return (
    <div className={`form form2 ${isOpen ? 'open' : 'closed'}`}>
      <form onSubmit={handleLogin}>
        <h3>Blue MarketPlace</h3>
        <input type="email" placeholder="email" value={email} onChange={handleEmailChange} />
        <input type="password" placeholder="password" value={password} onChange={handlePasswordChange} />
        <p>
          I do not have an account? <span onClick={onOpen}>Signup</span>
        </p>
        <button type="submit">Login</button>
      </form>
      <style>
        {`
          input[type="text"],
          input[type="email"],
          input[type="password"] {
            text-transform: none;
          }
        `}
      </style>
    </div>
  );
}

export default LoginForm;
