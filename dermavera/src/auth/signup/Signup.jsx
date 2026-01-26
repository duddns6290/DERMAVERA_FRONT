import "./Signup.css";
import logo from "../../assets/logo/logo.png";

export default function Signup() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    console.log("signup submit", data);
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
            name="name"
            type="text"
            placeholder="Name (optional)"
          />

          <input
            className="signup-input"
            name="email"
            type="email"
            placeholder="Email"
            required
          />

          <input
            className="signup-input"
            name="password"
            type="password"
            placeholder="Password"
            required
          />

          <input
            className="signup-input"
            name="passwordConfirm"
            type="password"
            placeholder="Confirm password"
            required
          />

          <button className="signup-btn" type="submit">
            Create account
          </button>

          <div className="signup-links">
            <a href="/login">Already have an account? Login</a>
          </div>
        </form>
      </div>
    </div>
  );
}
