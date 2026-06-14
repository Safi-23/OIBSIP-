import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import pizzaImg from "../assets/pizza.png";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const { data } = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      data.user.isAdmin
        ? navigate("/admin")
        : navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const isMobile = window.innerWidth < 768;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#151313",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          background: "#241F1F",
          borderRadius: "24px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          overflow: "hidden",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            flex: 1,
            padding: isMobile ? "30px" : "50px",
            color: "white",
          }}
        >
          <h1
            style={{
              margin: 0,
              marginBottom: "40px",
              fontSize: "28px",
              color: "#FF8C00",
            }}
          >
            PIZZA<span style={{ color: "white" }}>HOT</span>
          </h1>

          <h2
            style={{
              fontSize: "42px",
              marginBottom: "10px",
            }}
          >
            Welcome Back! 🍕
          </h2>

          <p
            style={{
              color: "#BBBBBB",
              marginBottom: "30px",
            }}
          >
            Login to continue ordering your favorite pizzas.
          </p>

          {error && (
            <div
              style={{
                background: "#ffebee",
                color: "#c62828",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "15px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px",
                marginBottom: "15px",
                borderRadius: "10px",
                border: "1px solid #444",
                background: "#2F2A2A",
                color: "white",
                fontSize: "15px",
                boxSizing: "border-box",
              }}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "14px",
                marginBottom: "8px",
                borderRadius: "10px",
                border: "1px solid #444",
                background: "#2F2A2A",
                color: "white",
                fontSize: "15px",
                boxSizing: "border-box",
              }}
            />

            <div
              style={{
                textAlign: "right",
                marginBottom: "20px",
              }}
            >
              <Link
                to="/forgot-password"
                style={{
                  color: "#BBBBBB",
                  textDecoration: "none",
                  fontSize: "13px",
                }}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: "#FF8C00",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "0.3s",
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p
            style={{
              marginTop: "20px",
              color: "#BBBBBB",
            }}
          >
            No account?{" "}
            <Link
              to="/register"
              style={{
                color: "#FF8C00",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Register here
            </Link>
          </p>
        </div>

        <div
          style={{
            flex: 1,
            background: "#1C1818",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "30px",
          }}
        >
          <img
            src={pizzaImg}
            alt="Pizza"
            style={{
              width: '100%',
              maxWidth: '400px',
              objectFit: 'contain'
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;