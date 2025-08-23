// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import Navbar from './components/Navbar'
// import MidContent from './components/MidContent'
// import Tester from './components/Tester'

// function App() {

//   return (
//     <>
//       <Navbar></Navbar>
//       <MidContent></MidContent>
//     </>
//   )
// }

// export default App


import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <>
      <Navbar />
      <Outlet />  {/* This renders the child route (MidContent, Tester, etc.) */}
    </>
  )
}

export default App
