import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import apiService from '../connection_services/service';

const SignUp = () => {
  const [formData, setFormData] = useState({username: '',email: '',password: '',});
  const [errors, setErrors] = useState({username: '',email: '',password: '',});
  const dispatch = useDispatch()

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
      username: '',
      email: '',
      password: '',
    };

    // Validate username
    if (formData.username.trim() === '') {
      valid = false;
      errorMessages.username = 'Username is required';
    }

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      
      await apiService.signup({
        Name: formData.username,
        Email: formData.email,
        Password: formData.password,
      })
      .then(() => {
        console.log("Login Successful")
        navigate("/");
      })
     .catch((err) => console.error(err));
  
     setFormData({email: '', password: '' });

    } catch (error) {
      setErrorMessage(error.response?.data?.message || "SignUp failed!");
    }

  };

  return (
    <div className="flex flex-col w-full items-center justify-center sm:p-6 smd:px-15 md:p-1">
      <h2 className="text-center text-blue-900 md:text-2xl sm:text-lg mt-4 font-bold leading-tight">Signup to create account</h2>
        <p className="mt-2 mb-8 sm:text-sm md:text-base text-center text-black/60">
            Already have an account?&nbsp;
            <Link
                to="/login"
                className="font-bold text-primary transition-all duration-200 text-sky-600 hover:animate-pulse">
                Sign In
            </Link>
        </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Name</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter Name"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && <small className="error">{errors.username}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="enter email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <small className="error">{errors.email}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <small className="error">{errors.password}</small>}
        </div>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
