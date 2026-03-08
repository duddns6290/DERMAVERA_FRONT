import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";
import logo from "../../assets/logo/logo.svg";
import { signup as apiSignup } from "../../api/client";

export default function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const userId = form.userId?.value?.trim();
    const password = form.password?.value;
    const passwordConfirm = form.passwordConfirm?.value;
    const userName = form.userName?.value?.trim() || undefined;

    if (!userId || !password) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 4) {
      setError("비밀번호는 4자 이상 입력해주세요.");
      return;
    }

    try {
      await apiSignup(userId, password, userName);
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message || "회원가입에 실패했습니다.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <div className="signup-brand">
          <img src={logo} alt="dermavera logo" className="signup-logo" />
        </div>

        <h1 className="signup-title">Sign up</h1>
        <p className="signup-subtitle">Create your account.</p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            className="signup-input"
            name="userId"
            type="text"
            placeholder="User ID (아이디)"
            required
            autoComplete="username"
          />
          <input
            className="signup-input"
            name="userName"
            type="text"
            placeholder="Name (이름, 선택)"
            autoComplete="name"
          />
          <input
            className="signup-input"
            name="password"
            type="password"
            placeholder="Password"
            required
            autoComplete="new-password"
          />
          <input
            className="signup-input"
            name="passwordConfirm"
            type="password"
            placeholder="Confirm password"
            required
            autoComplete="new-password"
          />

          {error && <p className="signup-error" role="alert">{error}</p>}

          <button className="signup-btn" type="submit">
            Create account
          </button>

          <div className="signup-links">
            <Link to="/login">Already have an account? Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
