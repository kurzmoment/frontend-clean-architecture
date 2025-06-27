import React, { useEffect } from "react";
import { useNavigate } from "react-router";

export function meta() {
  return [
    { title: "Project Manager" },
    { name: "description", content: "Welcome to Project Manager!" },
  ];
}

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Redirecting...</div>
    </div>
  );
}
