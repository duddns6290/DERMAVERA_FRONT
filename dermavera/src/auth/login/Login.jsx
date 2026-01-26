import "./Login.css";
import logo from "../../assets/logo/logo.png";

export default function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    console.log("login submit", data);
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
          <input className="login-input" name="email" type="email" placeholder="Email" required />
          <input className="login-input" name="password" type="password" placeholder="Password" required />

          <button className="login-btn" type="submit">Login</button>

          <div className="login-links">
            <a href="/signup">Sign up</a>
          </div>
        </form>
      </div>
    </div>
  );
}
