import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MyPage from './pages/MyPage'
import Login from './auth/login/Login'
import Signup from './auth/signup/Signup'
import Diagnosis from './diagnosis/Diagnosis'
import Navbar from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/mypage" element={<MyPage/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/diagnosis" element={<Diagnosis/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App