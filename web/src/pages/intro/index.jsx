import React, { useState, useEffect } from "react";
import "../intro/intro.css";
import { Link } from "react-router-dom";
import axios from "axios";

const IntroPage = () => {
  const [introContent, setIntroContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/intro");
      const data = response.data;
      setIntroContent(data.payload);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  return (
    <div className="intro-page">
      <h1>{introContent.title}</h1>
      <p>{introContent.description}</p>
      <p>{introContent.subContent}</p>
      <Link to="/dashboard">
        <button className="get-started-button">Get Started</button>
      </Link>
    </div>
  );
};

export default IntroPage;
