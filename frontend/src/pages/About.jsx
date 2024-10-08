import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 mt-14">
      <h1 className="text-6xl font-bold text-orange-500 pb-6">About Me</h1>
      <div className="w-full md:w-2/3 lg:w-1/2 text-center">
        <p className="text-xl text-gray-600 mb-4">
          Hi, I'm <span className="text-orange-500">Huy Phung</span> – the sole developer behind <span className="text-orange-500">NoteScribe</span>
          , a personal project born out of my passion for coding and simplifying everyday tasks through technology.
        </p>
        <p className="text-xl text-gray-600 mb-4">
          NoteScribe is an intuitive audio recording app that helps users quickly capture and manage their voice notes,
          with features like <span className='text-orange-500'>live recording, upload audio, transcribe, and translate up to 52 supported languages</span>.
          Whether you're taking notes, recording ideas, or storing important information, NoteScribe is designed to streamline the process for you.
        </p>

        <h2 className="text-4xl font-bold text-gray-700 py-4">My Journey</h2>
        <p className="text-lg text-gray-500 mb-6">
          With a background in web development and experience building applications using modern technologies,
          I’ve always been fascinated by how code can make life easier. My goal with this project is to create a simple yet
          effective tool for capturing and organizing voice notes, using my skills in both front-end and back-end development.
        </p>

        <h2 className="text-4xl font-bold text-gray-700 py-4">Why I Built NoteScribe</h2>
        <p className="text-lg text-gray-500 mb-6">
          As someone who enjoys developing software that solves real-world problems, I saw a need for an app that could make
          the audio recording process smoother and more accessible. From personal notes to meeting recordings, I wanted to build
          something that anyone could use, no matter their level of technical expertise.
        </p>

        <h2 className="text-4xl font-bold text-gray-700 py-4">Key Features</h2>
        <ul className="list-disc text-lg text-gray-500 mb-6 text-left">
          <li className="my-2">
            <span className="font-bold text-gray-700">Audio Transcription:</span> Automatically transcribe recorded audio into text with high accuracy, turning voice recordings into readable documents.
          </li>
          <li className="my-2">
            <span className="font-bold text-gray-700">Multiple Language Support:</span> Transcribe audio in multiple languages and translate your transcriptions into different languages with ease.
          </li>
          <li className="my-2">
            <span className="font-bold text-gray-700">File Upload for Transcription:</span> Upload pre-recorded audio files for fast and accurate transcription, allowing you to turn any audio file into text.
          </li>
          <li className="my-2">
            <span className="font-bold text-gray-700">Export Transcriptions:</span> Save transcribed text as a document or copy it directly for future use, making it easy to work with your notes.
          </li>
          <li className="my-2">
            <span className="font-bold text-gray-700">Audio Playback with Text Syncing:</span> Play back the audio while seeing the synced transcription in real-time, making it easy to review and edit.
          </li>
        </ul>


        <h2 className="text-4xl font-bold text-gray-700 py-4">Looking Forward</h2>
        <p className="text-lg text-gray-500 mb-6">
          As I continue to develop and refine NoteScribe, I am excited to explore new features, such as integrating automatic
          transcription and AI-based note organization. This project is an ongoing journey, and I look forward to enhancing its
          capabilities.
        </p>

        <h2 className="text-4xl font-bold text-gray-700 py-4">Get in Touch</h2>
        <p className="text-lg text-gray-500 mb-6">
          If you have any feedback or suggestions, feel free to reach out! You can contact me
          at <a href="mailto:[YourEmail@example.com]" className="text-orange-500">huyphung3103@gmail.com</a>.
        </p>
      </div>
    </div>
  );
};

export default About;
