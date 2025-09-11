import React, { useState, useRef, useEffect } from 'react'
import { createPortal} from 'react-dom'
import LoginDropdown from '../Components/AuthComponents/LoginDropdown'
import SignupDropdown from '../Components/AuthComponents/SignupDropdown'
import { useAuth } from '../Components/AuthComponents/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth(); // Context

  const [showLoginDropdown, setShowLoginDropdown] = useState(false)
  const [showSignupDropdown, setShowSignupDropdown] = useState(false)
  const loginBtnRef = useRef(null)
  const signupBtnRef = useRef(null)
  const loginDropdownRef = useRef(null)
  const signupDropdownRef = useRef(null)

  const toggleLogin = () => {
    setShowLoginDropdown(prev => !prev)
    setShowSignupDropdown(false)
  }
  const toggleSignup = () => {
    setShowSignupDropdown(prev => !prev)
    setShowLoginDropdown(false)
  }

  const inverseDropdownshow = () => {
    setShowLoginDropdown(prev => !prev)
    setShowSignupDropdown(prev => !prev)
  }

  useEffect(() => {
    const handleDocClick = (e) => {
      const t = e.target
      if (!(showLoginDropdown || showSignupDropdown)) return

      const clickedInsideLogin = loginDropdownRef.current && loginDropdownRef.current.contains(t)
      const clickedInsideSignup = signupDropdownRef.current && signupDropdownRef.current.contains(t)
      const clickedLoginBtn = loginBtnRef.current && loginBtnRef.current.contains(t)
      const clickedSignupBtn = signupBtnRef.current && signupBtnRef.current.contains(t)

      if (!clickedInsideLogin && !clickedInsideSignup && !clickedLoginBtn && !clickedSignupBtn) {
        setShowLoginDropdown(false)
        setShowSignupDropdown(false)
      }
    }

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowLoginDropdown(false)
        setShowSignupDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleDocClick)
    document.addEventListener('touchstart', handleDocClick)
    document.addEventListener('keydown', handleEsc)

    return () => {
      document.removeEventListener('mousedown', handleDocClick)
      document.removeEventListener('touchstart', handleDocClick)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [showLoginDropdown, showSignupDropdown])

  return (

    <nav className="navbar grid grid-cols-3 justify-around items-center sticky top-0 p-3 bg-green-100 z-50">

      <div className='text-2xl font-extrabold flex justify-center text-green-700'>
        <h1 className='select-none'>Dr. Atif Shahzad</h1>
      </div>

      <div className="navbar-left flex items-center list-none justify-center gap-16">
        <ul className="flex gap-9 items-center justify-center">
          <Link to={'/'}><li className='text-green-600 cursor-pointer hover:text-green-800 font-semibold hover:underline transition-colors duration-200'>Home</li></Link>
          <Link to={'/courses'}><li className='text-green-600 cursor-pointer hover:text-green-800 font-semibold hover:underline transition-colors duration-200'>Courses</li></Link>
          <li className='text-green-600 cursor-pointer hover:text-green-800 font-semibold hover:underline transition-colors duration-200'>About</li>
          <li className='text-green-600 cursor-pointer hover:text-green-800 font-semibold hover:underline transition-colors duration-200'>Contact</li>
        </ul>
      </div>

      {user ? (
        <div className="flex items-center space-x-4">
          <span>Welcome, {user.name}!</span>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          {/* Your existing login/signup buttons */}
          <div className="navbar-right flex gap-4 justify-center">
            <button
              ref={loginBtnRef}
              className="btn bg-green-700 py-2 px-4 rounded-radius hover:bg-green-800 cursor-pointer text-gray-50 text-xs transition-colors duration-200"
              onClick={toggleLogin}
            >
              Log in
            </button>

            <button
              ref={signupBtnRef}
              className="btn bg-green-700 py-2 px-4 rounded-radius hover:bg-green-800 cursor-pointer text-gray-50 text-xs transition-colors duration-200"
              onClick={toggleSignup}
            >
              Sign Up
            </button>
          </div>
        </div>
      )}




      {/* Render dropdowns into document.body via portal so stacking contexts/fixed cards can't hide them */}
      {showLoginDropdown && createPortal(
        <div
          ref={loginDropdownRef}
          // keep wrapper full control of z-index and pointer events
          className="fixed right-16 top-16 z-[9999] pointer-events-auto"
        >
          <LoginDropdown inverseDropdownshow={inverseDropdownshow} />
        </div>,
        document.body
      )}

      {showSignupDropdown && createPortal(
        <div ref={signupDropdownRef} className="fixed right-16 top-16 z-[9999] pointer-events-auto">
          <SignupDropdown inverseDropdownshow={inverseDropdownshow} />
        </div>,
        document.body
      )}

    </nav>
  )
}

export default Navbar
