import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import NavBar from './components/Navbar'
import Main from './pages/Main'
import About from './pages/About'
import AudioPlayer from './pages/AudioPlayer'
import Footer from './components/Footer'
import Translate from './components/Translate'
import DocumentList from './pages/DocumentList'
import DocumentDetails from './pages/DocumentDetails'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'

export default function App() {
  return (
    <Router>
      <div className='flex flex-col min-h-screen'>
        <NavBar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/about" element={<About />} />
            <Route path="/transcribe" element={<AudioPlayer />} />
            <Route path="/translate" element={<Translate />} />
            <Route path="/a" element={<DocumentList />} />
            <Route path="/a/:id" element={<DocumentDetails />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/signup" element={<SignUp />}/>
            <Route path="*" element={<Navigate to="/"/>}/>
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  )
}