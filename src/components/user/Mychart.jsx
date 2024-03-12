import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import axios from "axios";
import Cookies from "js-cookie";

const MyChart = () => {
  const token = Cookies.get("token");
  const [chart, setChart] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [chartType, setChartType] = useState("daily"); // Set initial chart type here

  useEffect(() => {
    const fetchData = async () => {
      let endpoint = "";
      if (chartType === "daily") {
        endpoint = "http://localhost:3000/dashboard/daily/chart";
      } else if (chartType === "weekly") {
        endpoint = "http://localhost:3000/dashboard/weekly/chart";
      } else if (chartType === "monthly") {
        endpoint = "http://localhost:3000/dashboard/monthly/chart";
      }

      try {
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setSalesData(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [chartType, token]); // Fetch data when chart type or token changes

  useEffect(() => {
    if (!salesData?.length) return; // Check if salesData is defined and not empty

    const createChart = () => {
      const ctx = document.getElementById("myChart").getContext("2d");
      if (chart) {
        chart.destroy(); // Destroy previous chart if it exists
      }

      const borderColor = {
        daily: "rgba(75, 192, 192, 1)",
        weekly: "rgba(54, 162, 235, 1)",
        monthly: "rgba(255, 99, 132, 1)",
      };

      const newChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: salesData.map((data) => data.sales_person),
          datasets: [
            {
              label: "Amount of Product",
              data: salesData.map((data) => data.amount_of_product),
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: borderColor[chartType],
              borderWidth: 1,
            },
          ],
        },
        options: {
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) => {
                  const date = salesData[context.dataIndex].date;
                  const amount = context.parsed.y;
                  return `Date: ${date}\nAmount of Product: ${amount}`;
                },
              },
            },
          },
        },
      });
      setChart(newChart);
    };

    createChart();

    return () => {
      if (chart) {
        chart.destroy(); // Clean up chart on component unmount
      }
    };
  }, [salesData, chartType]); // Re-render chart when sales data or chart type changes

  return (
    <div className="container mx-auto min-h-screen">
      <div className="flex gap-5 py-5">
        <button className="btn" onClick={() => setChartType("daily")}>
          Daily
        </button>
        <button className="btn" onClick={() => setChartType("weekly")}>
          Weekly
        </button>
        <button className="btn" onClick={() => setChartType("monthly")}>
          Monthly
        </button>
      </div>
      <canvas id="myChart"></canvas>
    </div>
  );
};

export default MyChart;
