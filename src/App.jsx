import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import NavBar from './components/Navbar'
import Main from './pages/Main'
import About from './pages/About'
import AudioPlayer from './pages/AudioPlayer'
import Footer from './components/Footer'

export default function App() {
  return (
    <Router>
      <div className='flex flex-col min-h-screen'>
        <NavBar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/about" element={<About />} />
            <Route path="/test" element={<AudioPlayer />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  )
}