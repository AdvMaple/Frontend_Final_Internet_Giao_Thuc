import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export function GenderChart(props) {
  const data = {
    labels: ["Nam", "Nữ"],
    datasets: [
      {
        label: "Phân bổ giới tinh",
        data: props.data,
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 5,
      },
    ],
  };

  return <Pie data={data} />;
}
