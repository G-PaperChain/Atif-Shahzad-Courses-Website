import Navbar from './components/Navbar'
import "./App.css"
import MidContent from './Components/MidContent'
import { AuthProvider } from './Components/AuthComponents/AuthContext';

function App() {
  return (
    <>
      <AuthProvider>
        <Navbar />
        <MidContent />
      </AuthProvider>
    </>
  )
}

export default App
