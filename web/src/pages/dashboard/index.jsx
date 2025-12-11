import React, { useState, useEffect } from "react";
import "./dashboard.css"; // Import the CSS file
import axios from "axios";
import loadingGif from "../../assets/loading.gif";
import constructionGif from "../../assets/construction.gif";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setTimeout(async () => {
        const response = await axios.get("/api/dashboard");
        const data = response.data
        setDashboardData(data.payload);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  return (
    <div className="construction-container">
      {loading && (
        <div>
          <img src={loadingGif} alt="loading..." style={{ width: "20vw" }} />
          <h1
            style={{
              color: "black",
            }}
          >
            Loading...
          </h1>
        </div>
      )}
      {!loading && (
        <div>
          <img
            src={constructionGif}
            alt="construction"
            style={{ width: "20vw" }}
          />
          <h1>{dashboardData.message}</h1>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
