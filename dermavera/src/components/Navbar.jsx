import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className='navbar'>
      <Link to='/' className='navbar-logo'>DERMAVERA</Link>

      <div className='navbar-right'>
        <span className='navbar-menu'>
          <Link to="/">Home</Link>
          <Link to="/mypage">MyPage</Link>
          <Link to="/diagnosis">Diagnosis</Link>
        </span>

        <span className='navbar-auth'>
          {user ? (
            <>
              <span className='navbar-user'>{user.userName || user.userId}님</span>
              <button type="button" className='navbar-logout' onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <Link to="/login">Log in</Link>
          )}
        </span>
      </div>
    </div>
  )
}

export default Navbar
