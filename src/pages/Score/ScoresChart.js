import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export function ScoresChart(props) {
  // console.log(props.data);
  let scoreCat = {
    a: 0,
    b: 0,
    c: 0,
    d: 0,
  };
  const processScore = () => {
    for (let i = 0; i < props.data.length; i = i + 1) {
      if (props.data[i] > 6.1 && props.data[i] <= 7) {
        scoreCat.a = scoreCat.a + 1;
      }
      if (props.data[i] > 7.1 && props.data[i] <= 8) {
        scoreCat.b = scoreCat.b + 1;
      }
      if (props.data[i] > 8.1 && props.data[i] <= 9) {
        scoreCat.c = scoreCat.c + 1;
      }
      if (props.data[i] > 9) {
        scoreCat.d = scoreCat.d + 1;
      }
    }
    let dataset = [];
    for (const cat in scoreCat) {
      dataset.push(scoreCat[cat]);
    }
    return dataset;
  };

  const data = {
    labels: ["6.1->7", "7.1->8.0", "8.1->9.0", "Trên 9.0"],
    datasets: [
      {
        label: "# of Votes",
        data: processScore(),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 5,
      },
    ],
  };

  return <Pie data={data} />;
}
