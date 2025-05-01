import React, { useState } from 'react';
import Swal from 'sweetalert2'; 
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function SignupForm({ onClose , onOpen}) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleForm = () => {
    setIsOpen(!isOpen);
    if (onClose) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
      MySwal.fire({
        icon: 'error',
        title: 'Passwords do not match',
      });
      return;
    }

    const userData = {
      username: username,
      email: email,
      password: password,
    };

    console.log('Submitting user data:', userData);

    fetch('https://bluecart-api.onrender.com/auth/register', {


      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        console.log('Response status:', response.status);
        console.log('Response OK:', response.ok);

        if (response.status === 201) {
          MySwal.fire({
            icon: 'success',
            title: 'Registration successful',
          });
        } else {
          MySwal.fire({
            icon: 'error',
            title: 'Registration failed',
          });
        }
      })
      .catch((error) => {
        console.error('Error during registration:', error);
        MySwal.fire({
          icon: 'error',
          title: 'An error occurred during registration',
        });
      });
  };

  return (
    <div className={`form ${isOpen ? 'open' : 'closed'}`}>
      <h3>Blue MarketPlace</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" id="username" placeholder="Username" required />
        <input type="email" id="email" placeholder="Email" required />
        <input
          type="password"
          id="password"
          required
          placeholder="Enter password"
        />
        <input
          type="password"
          id="confirmPassword"
          required
          placeholder="Confirm password"
        />
        <button type="submit">Sign Up</button>
        <p>
          Already have an account? <span onClick={onOpen}>Log In</span>
        </p>
      </form>
      <style>
        {`
          input[type="text"],
          input[type="email"],
          input[type="password"] {
            text-transform: none; /* Remove default capitalization */
          }
        `}
      </style>
    </div>
  );
}

export default SignupForm;
