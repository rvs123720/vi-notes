import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  
  const validatePassword = (pass: string) => {
    if (pass.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(pass)) return "Add at least one uppercase letter.";
    if (!/[0-9]/.test(pass)) return "Add at least one number.";
    if (!/[!@#$%^&*]/.test(pass)) return "Add a special character (!@#$%^&*).";
    return null;
  };

  const register = async () => {
    const validationError = validatePassword(password);
    if (validationError) {
      setError(validationError); 
      return;
    }

    try {
      setError("");
      await axios.post("https://vi-notes-4-7ic7.onrender.com/api/auth/register", {
        email,
        password,
      });
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left"></div>

      <div className="auth-right">
        <div className="auth-box">
          <div className="auth-title">VI-NOTES</div>

          <h2>Register</h2>

          {}
          {error && (
            <p style={{ 
              color: "#ff4d4d", 
              fontSize: "12px", 
              margin: "0 0 10px 0", 
              fontWeight: "bold" 
            }}>
              {error}
            </p>
          )}

          <input 
            placeholder="Email" 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            onChange={(e) => setPassword(e.target.value)} 
          />

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