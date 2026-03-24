import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", res.data.token);
    navigate("/dashboard");
  };

  return (
    <div className="auth-container">
      <div className="auth-left"></div>

      <div className="auth-right">
        <div className="auth-box">
          <div className="auth-title">VI-NOTES</div>

          <h2>Login</h2>

          <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

          <button onClick={login}>Login</button>

          <p>
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")} style={{ color: "blue", cursor: "pointer" }}>
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}