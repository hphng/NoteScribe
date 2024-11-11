import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext';
import { Menu, MenuButton, MenuItem, MenuItems, MenuSeparator } from '@headlessui/react'

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
    localStorage.removeItem('token');
    window.location.href = '/login';
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
        <ul className="flex gap-4 items-center">
          <li><Link to="/" className="hover:text-orange-500">Home</Link></li>
          <li><Link to="/about" className="hover:text-orange-500">About</Link></li>
          <li><Link to="/a" className="hover:text-orange-500">My Audio</Link></li>
          {!loading && (
            user ? (
              <li className='mr-4'>
                <Menu as="div" className="relative">
                  <MenuButton className="flex items-center transition data-[hover]:scale-110 data-[hover]:ease-in">
                    <img src={user.photo || defaultImage} alt="user" className="w-8 aspect-square rounded-full transition ease-in-out duration-200 hover:border-2 hover:border-orange-500 " />
                  </MenuButton>
                  <MenuItems
                    transition
                    anchor="bottom"
                    className="fixed z-50 right-0 mt-2 origin-top-right bg-orange-100 rounded-md text-center
                              ring-1 ring-black ring-opacity-5 focus:outline-none w-44 
                              border-2 border-black shadow-md shadow-orange-500
                              transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0">
                    <MenuItem disabled>
                      <a className="block px-4 py-2 text-sm cursor-default" href="/">
                        {user.name.substring(0, 8)}
                      </a>
                    </MenuItem>
                    <MenuSeparator className="h-[2px] bg-black" />
                    <MenuItem>
                      <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-200/70" href="/profile"> Profile </a>
                    </MenuItem>
                    <MenuItem>
                      <button onClick={logout} className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-orange-200/70">Logout</button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </li>
            ) : (
              <>
                <li><Link to="/login" className="hover:text-orange-500 mr-4">Login</Link></li>
              </>
            )
          )}
        </ul>
      </div>
    </nav>
  )
}

export default NavBar
