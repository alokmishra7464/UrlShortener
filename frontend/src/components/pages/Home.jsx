import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // If logged in, redirect to Dashboard
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}> ~~Welcome to URL Shortener~~</h1>
      <p style={styles.subtitle}>
        Shorten your links, track analytics, and share easily.
      </p>
      <div style={styles.buttons}>
        <Link to="/login" style={styles.btnPrimary}>Login</Link>
        <Link to="/register" style={styles.btnSecondary}>Register</Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "100px"
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "20px"
  },
  subtitle: {
    fontSize: "1.2rem",
    color: "#555",
    marginBottom: "30px"
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "20px"
  },
  btnPrimary: {
    background: "#007bff",
    color: "white",
    padding: "10px 20px",
    textDecoration: "none",
    borderRadius: "5px"
  },
  btnSecondary: {
    background: "#28a745",
    color: "white",
    padding: "10px 20px",
    textDecoration: "none",
    borderRadius: "5px"
  }
};

export default Home;
