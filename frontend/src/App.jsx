import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import './index.css'
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
            <Route path="/" exact element={<Main />} />
            <Route path="/a" exact element={<DocumentList />} />
            <Route path="/about" exact element={<About />} />
            <Route path="/transcribe" exact element={<AudioPlayer />} />
            <Route path="/translate" exact element={<Translate />} />
            <Route path="/a/:id" element={<DocumentDetails />}/>
            <Route path="/login" exact element={<Login />}/>
            <Route path="/signup" exact element={<SignUp />}/>
            <Route path="/profile" exact element={<Profile />} />
            <Route path="*" element={<Navigate to="/"/>}/>
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  )
}