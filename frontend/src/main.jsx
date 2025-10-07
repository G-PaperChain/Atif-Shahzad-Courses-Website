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
import { NcaaaCoursesContextProvider } from './Context/NcaaCourseContext.jsx';
import AboutPage from './Components/AboutComponents/AboutPage.jsx';
import AdminPanelNcaaaManagement from './Components/AdminComponents/AdminPanelNcaaaManagement.jsx';
import AdminUsersManagement from './Components/AdminComponents/AdminUsersManagement.jsx';

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
        children: [
          { index: true, path: "ncaaa-courses", element: <AdminPanelNcaaaManagement /> },
          { path: "users", element: <AdminUsersManagement /> }
        ],
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
        <NcaaaCoursesContextProvider>
          <CourseContextProvider>
            <ResearchContextProvider>
              <RouterProvider router={router} />
            </ResearchContextProvider>
          </CourseContextProvider>
        </NcaaaCoursesContextProvider>
      </AuthProvider>
    </PrimeReactProvider>
  </StrictMode>

)