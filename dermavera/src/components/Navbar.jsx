import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
    return (
        <div className='navbar'> 
            <Link to='/' className='navbar-logo'>DERMAVERA</Link>

            <div className='navbar-right'>
                <span className='navbar-menu'>
                    <Link to="/">Home</Link>
                    <Link to="/mypage">MyPage</Link>
                </span>

                <span className='navbar-auth'>
                    <Link to="/login">Log in</Link>
                </span>
            </div>
        </div>
    )
}

export default Navbar