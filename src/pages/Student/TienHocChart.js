import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

export default function TienHocChart(props) {
  function processTienHoc() {
    let data = [];
    for (let key in props.data) {
      data.push(props.data[key]);
    }
    return data;
  }

  const data = {
    labels: ["Đã đóng", "Chưa đóng"],
    datasets: [
      {
        label: "Biểu đồ đã đóng tiền học",
        data: processTienHoc(),
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 5,
      },
    ],
  };

  return <>{props.data.length !== 0 ? <Pie data={data} /> : ""}</>;
}
