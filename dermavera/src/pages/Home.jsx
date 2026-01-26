import { Link } from 'react-router-dom'
import './Home.css'
import logo from '../assets/logo/logo.png'

export default function Home() {
    return (
        <div className='home'>
            <div className='home-content'>
                <p className='home-title'>AI를 통해 반려동물의 피부 상태를 간편하게 분석해보세요</p>
                <p className='home-desc'>
                    DERMAVERA는 반려동물의 피부 사진을 업로드하면<br/>
                    AI가 피부 상태를 분석하여 결과를 제공하는 서비스입니다
                </p>

                <Link to="/diagnosis">
                    <button className='home-button'>피부 진단 시작하기</button>
                </Link>
            </div>
            <div className="home-visual">
                <img src={logo} alt="DERMAVERA logo" className="home-logo-img" />
            </div>
        </div>

    )
}
