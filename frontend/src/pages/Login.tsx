import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  const login = async () => {
    try {
      setError(""); 
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      const message = err.response?.data?.message || "Something went wrong";
      setError(message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setError("");
      const res = await axios.post("http://localhost:5000/api/auth/google-login", {
        token: credentialResponse.credential,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError("Google authentication failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left"></div>

      <div className="auth-right">
        <div className="auth-box">
          <div className="auth-title">VI-NOTES</div>

          <h2>Login</h2>

          {error && (
            <div style={{ 
              color: "white", 
              backgroundColor: "#ff4d4d", 
              padding: "10px", 
              borderRadius: "5px", 
              marginBottom: "15px",
              fontSize: "14px",
              textAlign: "center" 
            }}>
              {error}
            </div>
          )}

          <input 
            placeholder="Email" 
            onChange={(e) => setEmail(e.target.value)} 
          />
          
          {}
          <div style={{ position: "relative", width: "100%", marginBottom: "15px" }}>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ 
                width: "107%", 
                paddingRight: "40px", 
                boxSizing: "border-box" 
              }} 
            />
            <span 
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "24px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#666",
                display: "flex",
                alignItems: "center"
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <button onClick={login}>Login</button>

          <div style={{ marginTop: "15px", display: "flex", justifyContent: "center" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google Login Failed")}
              theme="outline"
              size="large"
              width="101%"
            />
          </div>

          <p>
            Don't have an account?{" "}
            <span 
              onClick={() => navigate("/register")} 
              style={{ color: "blue", cursor: "pointer" }}
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}