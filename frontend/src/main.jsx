import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Courses from './Components/CoursesComponents/CoursesPage.jsx';
import AdminPanel from './Components/AdminComponents/AdminPanel.jsx';
import { AuthProvider } from './Components/AuthComponents/AuthContext.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: "courses", element: <Courses /> },
      { path: "admin", element: <AdminPanel /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </AuthProvider>
)