import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const register = async () => {
    await axios.post("http://localhost:5000/api/auth/register", {
      email,
      password,
    });

    navigate("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-left"></div>

      <div className="auth-right">
        <div className="auth-box">
          <div className="auth-title">VI-NOTES</div>

          <h2>Register</h2>

          <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

          <button onClick={register}>Register</button>

          <p>
            Already have an account?{" "}
            <span onClick={() => navigate("/")} style={{ color: "blue", cursor: "pointer" }}>
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}