import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 w-full mt-auto">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and About */}
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold text-orange-500">NoteScribe</h2>
            <p className="text-gray-400 mt-2">
              Simplifying your audio recording and transcription needs.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <a href="/about" className="text-gray-400 hover:text-orange-500">
              About Me
            </a>
            <a href="mailto:huyphung3103@gmail.com" className="text-gray-400 hover:text-orange-500">
              Contact
            </a>
            <a href="/privacy" className="text-gray-400 hover:text-orange-500">
              Privacy Policy
            </a>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="https://github.com/yourprofile" className="text-gray-400 hover:text-orange-500">
              <FontAwesomeIcon icon={faGithub} size="2x" />
            </a>
            <a href="https://linkedin.com/in/yourprofile" className="text-gray-400 hover:text-orange-500">
              <FontAwesomeIcon icon={faLinkedin} size="2x" />
            </a>
            <a href="https://twitter.com/yourprofile" className="text-gray-400 hover:text-orange-500">
              <FontAwesomeIcon icon={faTwitter} size="2x" />
            </a>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center mt-6 border-t border-gray-700 pt-4">
          <p className="text-gray-500">&copy; {new Date().getFullYear()} NoteScribe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
