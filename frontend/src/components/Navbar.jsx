import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

const NavBar = () => {
  const [scroll, setScroll] = useState(false)
  const { user, loading } = useContext(AuthContext);

  const defaultImage = "https://via.placeholder.com/150"

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    console.log("IN NAVBAR", user);
    return () => window.removeEventListener('scroll', handleScroll)
  }, []);

  if (loading) return;
  const logout = () => {
    console.log("LOGOUT");
  }

  const displayName = () => {
    console.log(user.name.substring(0, 8));
    return user.name.substring(0, 8); 
  }

  return (
    <nav className={`fixed w-full top-0 z-40 transition duration-300 ease-in-out pl-4
      ${scroll ? 'bg-slate-800 text-white shadow-md shadow-slate-500' : 'bg-transparent text-black shadow-md shadow-neutral-300'}  py-4`}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          <Link to="/" className="">Note<span className="text-orange-500">Scribe</span></Link>
        </h2>
        <ul className="flex gap-4">
          <li><Link to="/" className="hover:text-orange-500">Home</Link></li>
          <li><Link to="/about" className="hover:text-orange-500">About</Link></li>
          <li><Link to="/a" className="hover:text-orange-500">My Audio</Link></li>
          {!loading && (
            user ? (
              <li className=''>
                <Menu as="div" className="relative">
                  <MenuButton className="flex items-center">
                    <img src={defaultImage || user.photo} alt="user" className="w-8 aspect-square rounded-full" />
                  </MenuButton>
                  <MenuItems 
                    className="fixed right-0 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg 
                              ring-1 ring-black ring-opacity-5 focus:outline-none ">
                    <MenuItem>
                      <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" href="/profile"> {user.name.substring(0, 8)} </a>
                    </MenuItem>
                    <MenuItem>
                      <button onClick={logout} className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </li>
            ) : (
              <>
                <li><Link to="/login" className="hover:text-orange-500">Login</Link></li>
                <li><Link to="/signup" className="hover:text-orange-500">Sign Up</Link></li>
              </>
            )
          )}
        </ul>
      </div>
    </nav>
  )
}

export default NavBar
