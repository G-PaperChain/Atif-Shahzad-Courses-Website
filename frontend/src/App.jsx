import "./App.css"
import MidContent from './Components/MidContent'
// import { useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from './Components/AuthComponents/AuthContext'

function App() {
  // const { api } = useAuth();

  // // Setup CSRF token for all requests
  // useEffect(() => {
  //   const setupCSRF = async () => {
  //     try {
  //       // Get CSRF token from backend
  //       await axios.get('https://api.dratifshahzad.com/api/csrf-token', {
  //         withCredentials: true
  //       });

  //       // Add CSRF token to all requests
  //       api.interceptors.request.use((config) => {
  //         const csrfToken = getCookie('csrf_token');
  //         if (csrfToken) {
  //           config.headers['X-CSRF-TOKEN'] = csrfToken;
  //         }
  //         return config;
  //       });
  //     } catch (error) {
  //       console.error('CSRF setup failed:', error);
  //     }
  //   };

  //   setupCSRF();
  // }, [api]);

  // // Helper function to get cookies
  // const getCookie = (name) => {
  //   const value = `; ${document.cookie}`;
  //   const parts = value.split(`; ${name}=`);
  //   if (parts.length === 2) return parts.pop().split(';').shift();
  // };
  return (
    <>
      <MidContent />
    </>
  )
}

export default App