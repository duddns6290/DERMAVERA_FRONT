import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import MyPage from './pages/MyPage'
import Login from './auth/login/Login'
import Signup from './auth/signup/Signup'
import Diagnosis from './diagnosis/Diagnosis'
import Navbar from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/mypage" element={<MyPage/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/diagnosis" element={<Diagnosis/>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
