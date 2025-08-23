// import React from 'react'
// import './Navbar.css'
// import logo from '../assets/logo.png'
// import { Link } from 'react-router-dom'

// const Navbar = () => {
//     return (
//         <nav className="navbar"> 
//             <div className="navbar-left">
//                 <ul className="nav-links">
//                     <Link to={"/tester"}><img src={logo} className="logo" /></Link>
//                     <li className="navbar-item">Home</li>
//                     <li className="navbar-item">Courses</li>
//                     <li className="navbar-item">About</li>
//                     <li className="navbar-item">Blog</li>
//                 </ul>
//             </div>
//             <div className="navbar-right">
//                 <button className="btn">Contact Us</button>
//                 <button className="btn">Log In</button>
//             </div>
//         </nav>
//     )
// }

// export default Navbar

import React from 'react'
import './Navbar.css'
import logo from '../assets/logo.png'
import { Link, NavLink } from 'react-router-dom'

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <ul className="nav-links">
                    <li><Link to="/"><img src={logo} className="logo" alt="Logo" /></Link></li>
                    <li><NavLink to="/" className={(e) => { return e ? "navbar-item" : "" }}>Home</NavLink></li>
                    <li><NavLink to="/tester" className={(e) => { return e ? "navbar-item" : "" }}>Courses</NavLink></li>
                    <li><NavLink to="/about" className={(e) => { return e ? "navbar-item" : "" }}>About</NavLink></li>
                    <li><NavLink to="/blog" className={(e) => { return e ? "navbar-item" : "" }}>Blog</NavLink></li>
                </ul>
            </div>
            <div className="navbar-right">
                <button className="btn">Log In</button>
                <button className="btn">Sign Up</button>
            </div>
        </nav>
    )
}

export default Navbar
