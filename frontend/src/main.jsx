import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Courses from './Components/CoursesComponents/CoursesPage.jsx';
import AdminPanel from './Components/AdminComponents/AdminPanel.jsx';
import { AuthProvider } from './Components/AuthComponents/AuthContext.jsx';
import Layout from './Components/Layout.jsx';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import NCAAA_Page from './Components/NCAAA_Components/NCAAA_Page.jsx';
import Course from './Components/CoursesComponents/Course.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';
import { CourseContextProvider } from './Context/CourseContext.jsx';
import { ResearchContextProvider } from './Context/ResearchContext.jsx';
import AboutPage from './Components/AboutComponents/AboutPage.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <div>⚠️ Something went wrong. Please try again later.</div>,
    children: [
      { index: true, element: <App /> },
      { path: "courses", element: <Courses /> },
      {
        path: "admin",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminPanel />
          </ProtectedRoute>
        )
      },
      { path: "ncaaa", element: <NCAAA_Page /> },
      { path: "course/:course_code", element: <Course /> },
      { path: "about", element: <AboutPage /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrimeReactProvider>
      <AuthProvider>
        <CourseContextProvider>
          <ResearchContextProvider>
            <RouterProvider router={router} />
          </ResearchContextProvider>
        </CourseContextProvider>
      </AuthProvider>
    </PrimeReactProvider>
  </StrictMode>

)