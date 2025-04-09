import { Button } from "@mui/material";
import React from "react";
import { useHistory } from "react-router-dom";
import { HomeCard } from "./Home.styles";

function Card({ role, src, link }) {
  const navigate = useHistory(); // MUI v5 with React Router v6

  return (
    <HomeCard>
      <img width="100%" height="100%" src={src} alt={role} />
      <h1>{role.toUpperCase()}</h1>
      <p>Click Below to Login</p>
      <Button variant="contained" onClick={() => navigate("/login", { state: role })}>
        Log In
      </Button>
    </HomeCard>
  );
}

export default Card;