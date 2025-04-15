import React, { useState } from "react";
import { Container, Box, TextField, Button, Typography, Checkbox, FormControlLabel } from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";

const Background = styled(Box)({
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #00338D 30%, #0072CE 100%)",
});

const SignInBox = styled(Box)({
  width: "400px",
  padding: "30px",
  borderRadius: "10px",
  backgroundColor: "#ffffff",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  textAlign: "center",
});

const StyledButton = styled(Button)({
  background: "linear-gradient(90deg, #00338D, #0072CE)",
  color: "white",
  fontWeight: "bold",
  padding: "10px",
  marginTop: "10px",
  '&:hover': {
    background: "#005EA8",
  }
});

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("Sign in successful");
        navigate("/dashboard");
      } else {
        alert(data.message || "Sign in failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <SignInBox>
        <Typography variant="h5" fontWeight="bold" color="#00338D" gutterBottom>
          Sign in
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControlLabel
            control={<Checkbox color="primary" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />}
            label="Remember me"
          />
          <StyledButton fullWidth variant="contained" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </StyledButton>
        </form>
        <Typography variant="body2" color="textSecondary" mt={2}>
          Forgot Your Password? <span style={{ color: "#0072CE", cursor: "pointer" }}>Reset</span>
        </Typography>
      </SignInBox>
    </Background>
  );
}

export default SignIn;