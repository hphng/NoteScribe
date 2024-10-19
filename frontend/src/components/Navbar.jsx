import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {
  const [scroll, setScroll] = useState(false)

  useEffect(() => {
    window.addEventListener('scroll', () => {
      setScroll(window.scrollY > 50)
    })
  }, []);

  return (
    <nav className={`fixed w-full top-0 z-50 transition duration-300 ease-in-out pr-8 pl-4
      ${scroll ? 'bg-slate-800 text-white shadow-md shadow-slate-500' : 'bg-transparent text-black shadow-md shadow-neutral-300'}  py-4`}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          <Link to="/" className="">Note<span className="text-orange-500">Scribe</span></Link>
        </h2>
        <ul className="flex space-x-4">
          <li><Link to="/" className="hover:text-orange-500">Home</Link></li>
          <li><Link to="/about" className="hover:text-orange-500">About</Link></li>
          <li><Link to="/a" className="hover:text-orange-500">My Audio</Link></li>
        </ul>
      </div>
    </nav>
  )
}

export default NavBar
