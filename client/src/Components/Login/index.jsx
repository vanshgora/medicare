import { Button, Paper, TextField } from "@mui/material";
import jwt from "jwt-decode";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Nav, Navbar, NavItem } from "reactstrap";
import styled from "styled-components";
import axiosInstance from "../../utils/axiosInstance";
import LoginCard from "./LoginCard";

const LoginPaper = styled(Paper)`
  width: 100%;
  max-width: 500px;
  height: 500px;
  display: flex;
  padding: 80px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  @media (max-width: 780px) {
    flex-direction: column;
  }
`;

const LoginContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

function LogIn() {
  const location = useLocation();
  const navigate = useHistory();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) {
      setLoginError("Please enter email and password");
      return;
    }

    try {
      const res = await axiosInstance.post("/login", {
        role: location.state,
        email,
        password,
      });
      const token = res.data.token;
      const { name, role } = jwt(token);

      dispatch({ type: "LOG_IN", payload: { token, name, role } });

      if (role === "admin") {
        navigate("/doctors/");
      } else if (role === "doctor") {
        navigate("/doctor/profile");
      } else {
        navigate("/user/profile");
      }
    } catch (err) {
      console.error(err);
      setLoginError(err?.response?.data?.error || "Login failed");
    }
  };

  if (!location.state) {
    navigate("/");
    return null;
  }

  return (
    <>
      <Navbar style={{ backgroundColor: "#242526" }} expand="md">
        <Nav className="mr-auto" navbar>
          <NavItem
            style={{
              color: "white",
              padding: "20px",
              fontSize: "20px",
            }}
          >
            <Link style={{ textDecoration: "none", color: "white" }} to="/">
              Home
            </Link>
          </NavItem>
        </Nav>
      </Navbar>

      <Container>
        <LoginCard role={location.state} />
        <LoginContainer>
          <LoginPaper elevation={3}>
            <h1>Login</h1>
            <p style={{ color: "red" }}>{loginError}</p>

            <TextField
              type="text"
              fullWidth
              autoFocus
              label="Email"
              variant="outlined"
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              type="password"
              label="Password"
              fullWidth
              variant="outlined"
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              variant="contained"
              color="primary"
              type="submit"
              onClick={handleSubmit}
            >
              Log In
            </Button>
          </LoginPaper>
        </LoginContainer>
      </Container>
    </>
  );
}

export default LogIn;
