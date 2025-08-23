// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import Tester from './components/Tester.jsx'
// import { createBrowserRouter, RouterProvider } from 'react-router-dom'


// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,   // App is now part of routing
//   },
//   {
//     path: "/tester",
//     element: <Tester />,
//   }
// ]);



// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <RouterProvider router={router}/>
//   </StrictMode>,
// )


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MidContent from './components/MidContent'
import Tester from './components/Tester'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true, // default child for "/"
        element: <MidContent />,
      },
      {
        path: "tester",
        element: <Tester />,
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
