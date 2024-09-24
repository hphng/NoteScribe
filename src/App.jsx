import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar'
import Main from './pages/Main'
import About from './pages/About'

export default function App() {
  return (
    <Router>
      <div className='flex flex-col min-h-screen'>
        <NavBar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}