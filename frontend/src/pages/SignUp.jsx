import React, { useState } from 'react';
import { Field, Fieldset, Input, Label, Legend, Select } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faImage, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faFacebook, faGithub } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    photo: null,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prevShow) => !prevShow);
  };

  // Form validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Please enter a valid email address';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      console.log('Form data submitted:', formData);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, formData, {
        withCredentials: true,
      });
      console.log('Signup response:', response.data);
    } catch (error) {
      console.error('Error signing up:', error.message);
    }
    // Redirect to home page after successful signup
    window.location.href = '/';
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSignupSubmit} className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg shadow-orange-500 border-2 border-black">
        <Fieldset className="space-y-4">
          <Legend className="text-2xl font-bold text-center text-orange-500 mb-4">Sign Up</Legend>

          {/* Username Field */}
          <Field>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:border-orange-500">
              <FontAwesomeIcon icon={faUser} className="text-gray-500" />
              <Input
                type="text"
                name="name"
                placeholder="Username"
                value={formData.name}
                onChange={handleInputChange}
                className="flex-1 ml-3 outline-none "
              />
            </div>
            {errors.name && <p className="text-red-500 text-sm pt-2">{errors.name}</p>}
          </Field>

          {/* Email Field */}
          <Field>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:border-orange-500">
              <FontAwesomeIcon icon={faEnvelope} className="text-gray-500" />
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="flex-1 ml-3 outline-none"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm pt-2">{errors.email}</p>}
          </Field>

          {/* Password Field */}
          <Field>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:border-orange-500">
              <FontAwesomeIcon icon={faLock} className="text-gray-500" />
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="flex-1 ml-3 outline-none"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="ml-2 text-gray-500"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm pt-2">{errors.password}</p>}
          </Field>

          {/* Confirm Password Field */}
          <Field>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:border-orange-500">
              <FontAwesomeIcon icon={faLock} className="text-gray-500" />
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="flex-1 ml-3 outline-none"
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm pt-2">{errors.confirmPassword}</p>}
          </Field>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-200"
          >
            Sign Up
          </button>
        </Fieldset>

        <div className="text-center my-4">
          <p>
            Already have an account?{' '}
            <a href="/login" className="text-orange-500 hover:underline">
              Login
            </a>
          </p>
        </div>

        <div className='text-gray-400 border-t-2 border-t-gray-200'>
          <p className='text-center my-2'>or you can sign in with</p>
          <div className='w-full flex flex-row justify-center gap-4'>
            <button onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`}>
              <FontAwesomeIcon 
                icon={faGoogle} 
                className='text-2xl hover:text-google hover:scale-110 transition ease-in-out duration-200' 
              />
            </button>
            <button onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`}>
              <FontAwesomeIcon 
                icon={faFacebook} 
                className='text-2xl hover:text-facebook hover:scale-110 transition ease-in-out duration-200' 
              />
            </button>
            <button onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`}>
              <FontAwesomeIcon 
                icon={faGithub} 
                className='text-2xl hover:text-github hover:scale-110 transition ease-in-out duration-200' 
              />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;
