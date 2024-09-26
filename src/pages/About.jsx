import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-6xl font-bold text-orange-500 pb-6">About Me</h1>
      <div className="w-full md:w-2/3 lg:w-1/2 text-center">
        <p className="text-xl text-gray-600 mb-4">
          Hi, I'm <span className="text-orange-500">[Your Name]</span> – the sole developer behind <span className="text-orange-500">NoteScribe</span>, a personal project born out of my passion for coding and simplifying everyday tasks through technology.
        </p>
        <p className="text-xl text-gray-600 mb-4">
          NoteScribe is an intuitive audio recording app that helps users quickly capture and manage their voice notes, with features like live recording, playback, and download options. Whether you're taking notes, recording ideas, or storing important information, NoteScribe is designed to streamline the process for you.
        </p>

        <h2 className="text-4xl font-bold text-gray-700 py-4">My Journey</h2>
        <p className="text-lg text-gray-500 mb-6">
          With a background in web development and experience building applications using modern technologies, I’ve always been fascinated by how code can make life easier. My goal with this project is to create a simple yet effective tool for capturing and organizing voice notes, using my skills in both front-end and back-end development.
        </p>

        <h2 className="text-4xl font-bold text-gray-700 py-4">Why I Built NoteScribe</h2>
        <p className="text-lg text-gray-500 mb-6">
          As someone who enjoys developing software that solves real-world problems, I saw a need for an app that could make the audio recording process smoother and more accessible. From personal notes to meeting recordings, I wanted to build something that anyone could use, no matter their level of technical expertise.
        </p>

        <h2 className="text-4xl font-bold text-gray-700 py-4">Key Features</h2>
        <ul className="list-disc text-lg text-gray-500 mb-6">
          <li className="my-2">
            <span className="font-bold text-gray-700">Live Audio Recording:</span> Record audio directly from your browser with high-quality sound.
          </li>
          <li className="my-2">
            <span className="font-bold text-gray-700">File Upload:</span> Upload and manage audio files for easy access and playback.
          </li>
          <li className="my-2">
            <span className="font-bold text-gray-700">Download Audio:</span> Save your recordings as MP3 files for future use.
          </li>
          <li className="my-2">
            <span className="font-bold text-gray-700">Playback Controls:</span> Use intuitive playback features such as pause, play, and volume control.
          </li>
        </ul>

        <h2 className="text-4xl font-bold text-gray-700 py-4">Looking Forward</h2>
        <p className="text-lg text-gray-500 mb-6">
          As I continue to develop and refine NoteScribe, I am excited to explore new features, such as integrating automatic transcription and AI-based note organization. This project is an ongoing journey, and I look forward to enhancing its capabilities.
        </p>

        <h2 className="text-4xl font-bold text-gray-700 py-4">Get in Touch</h2>
        <p className="text-lg text-gray-500 mb-6">
          If you have any feedback or suggestions, feel free to reach out! You can contact me at <a href="mailto:[YourEmail@example.com]" className="text-orange-500">[YourEmail@example.com]</a>.
        </p>
      </div>
    </div>
  );
};

export default About;
