import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import "./Login.css";
import logo from "../../assets/logo/logo.svg";
import { login as apiLogin, fetchMe, setToken } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

const KAKAO_LOGIN_URL = "/auth/kakao/login";

export default function Login() {
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setToken(token);
      setSearchParams({}, { replace: true });
      fetchMe()
        .then(() => {
          refreshAuth();
          navigate("/", { replace: true });
        })
        .catch(() => setError("로그인 정보를 불러오지 못했습니다."));
    }
  }, [searchParams, navigate, setSearchParams, refreshAuth]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const userId = form.userId?.value?.trim();
    const password = form.password?.value;

    if (!userId || !password) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      await apiLogin(userId, password);
      await fetchMe();
      refreshAuth();
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "로그인에 실패했습니다.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <img src={logo} alt="dermavera logo" className="login-logo" />
        </div>

        <h1 className="login-title">Login</h1>
        <p className="login-subtitle">Welcome. Please sign in.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            className="login-input"
            name="userId"
            type="text"
            placeholder="User ID"
            required
            autoComplete="username"
          />
          <input
            className="login-input"
            name="password"
            type="password"
            placeholder="Password"
            required
            autoComplete="current-password"
          />

          {error && <p className="login-error" role="alert">{error}</p>}

          <button className="login-btn" type="submit">Login</button>

          <div className="login-divider">또는</div>

          <a href={KAKAO_LOGIN_URL} className="login-kakao-btn">
            카카오로 로그인
          </a>

          <div className="login-links">
            <Link to="/signup">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
