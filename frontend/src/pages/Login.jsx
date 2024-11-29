import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faFacebook, faGithub } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prevShow) => !prevShow);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log('Logging in...');
    try{
      console.log('Form data submitted:', formData);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, formData, {
        withCredentials: true,
      });
      console.log('Login response:', response.data);
      window.location.href = '/';
    }catch(error){
      console.error('Error logging in:', error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 max-w-md w-full bg-white rounded-lg shadow-md shadow-orange-500 border-2 border-black ">
        <h2 className="text-2xl font-bold text-center text-orange-500 mb-4">Login</h2>
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:border-orange-500">
            <FontAwesomeIcon icon={faUser} className="text-gray-500" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="flex-1 ml-3 outline-none focus:outline-none"
              required
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:border-orange-500">
            <FontAwesomeIcon icon={faLock} className="text-gray-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="flex-1 ml-3 outline-none focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="ml-2 text-gray-500"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-200"
          >
            Login
          </button>
        </form>

        <div className="text-center my-4">
          <p>
            Don't have an account?{' '}
            <a href="/signup" className="text-orange-500 hover:underline">
              Sign Up
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
      </div>
    </div>
  );
};

export default LoginPage;
