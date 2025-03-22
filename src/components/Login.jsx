import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let valid = true;
    let errorMessages = {
      email: '',
      password: '',
    };

    // Validate email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(formData.email)) {
      valid = false;
      errorMessages.email = 'Invalid email format';
    }

    // Validate password
    if (formData.password.length < 6) {
      valid = false;
      errorMessages.password = 'Password must be at least 6 characters long';
    }

    setErrors(errorMessages);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Handle successful login (e.g., make an API call)
      alert('Logged in successfully!');
      // Reset form (optional)
      setFormData({ email: '', password: '' });
    }
  };

  return (
    <div className="flex flex-col w-full items-center justify-center sm:p-6 smd:px-15 md:p-1">

      <h2 className="text-center text-blue-900 md:text-2xl sm:text-lg mt-4 font-bold leading-tight">Sign in to your account</h2>
        <p className="mt-2 text-center sm:text-sm md:text-base text-black/60">
          Don&apos;t have any account?&nbsp;
          <Link
              to="/signup"
              className="font-bold text-primary transition-all duration-200 text-sky-600 hover:animate-pulse"> 
              Sign Up
          </Link>
        </p>

      <form onSubmit={handleSubmit}>
        <div className='flex flex-col'>
          <div className="space-y-5 font-bold sm:text-sm md:text-base">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder='Enter email'
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <small className="text-red-600 mt-8 text-center">{errors.email}</small>}
          </div>

          <div className="space-y-5 font-bold sm:text-sm md:text-base">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder='Enter password'
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <small className="text-red-600 mt-8 text-center">{errors.password}</small>}
          </div>

          <button type="submit">Login</button>

        </div>
      </form>
    </div>
  );
};

export default Login;

