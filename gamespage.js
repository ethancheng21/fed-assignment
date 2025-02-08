const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");

// Object that stores values of minimum and maximum angle for a value
const rotationValues = [
  { minDegree: 0, maxDegree: 30, value: "100🪙" },
  { minDegree: 31, maxDegree: 90, value: "500🪙" },
  { minDegree: 91, maxDegree: 150, value: "Orange Banner" },
  { minDegree: 151, maxDegree: 210, value: "1d Bump" },
  { minDegree: 211, maxDegree: 270, value: "Blue and Orange Banner"  },
  { minDegree: 271, maxDegree: 330, value: "200🪙" },
  { minDegree: 331, maxDegree: 360, value:  "100🪙"},
];
// Size of each piece
const data = [16, 16, 16, 16, 16, 16];

// Background color for each piece
const pieColors = [
  "#FF6F00", // Burnt Orange
  "#FFA726", // Amber Orange
  "#FF6F00", // Burnt Orange
  "#FFA726", // Amber Orange
  "#FF6F00", // Burnt Orange
  "#FFA726", // Amber Orange
];

// Create chart
let myChart = new Chart(wheel, {
  plugins: [ChartDataLabels],
  type: "pie",
  data: {
    labels: ["500🪙","100🪙", "200🪙","2X⍰Banner","1d Bump","⍰ Banner"],
    datasets: [
      {
        backgroundColor: pieColors,
        data: data,
        borderColor: "#008080", // Teal color for segment borders
        borderWidth: 4, // Thickness of the lines
      },
    ],
  },
  options: {
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      tooltip: false, // Hide tooltip
      legend: {
        display: false, // Hide legend
      },
      datalabels: {
        color: "#ffffff", // White text color
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 18 }, // Adjusted font size for better fit
        anchor: "center", // Center the labels
        align: "center", // Align labels properly
      },
    },
  },
});
const valueGenerator = (angleValue) => {
  for (let i of rotationValues) {
    //if the angleValue is between min and max then display it
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      finalValue.innerHTML = `<p>Value: ${i.value}</p>`;
      spinBtn.disabled = false;
      break;
    }
  }
};

// Start spinning
//Spinner count
let count = 0;
//100 rotations for animation and last rotation for result
let resultValue = 101;
//Start spinning
spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  //Empty final value
  finalValue.innerHTML = `<p>Good Luck!</p>`;
  //Generate random degrees to stop at
  let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
  //Interval for rotation animation
  let rotationInterval = window.setInterval(() => {
    //Set rotation for piechart
    /*
    Initially to make the piechart rotate faster we set resultValue to 101 so it rotates 101 degrees at a time and this reduces by 1 with every count. Eventually on last rotation we rotate by 1 degree at a time.
    */
    myChart.options.rotation = myChart.options.rotation + resultValue;
    //Update chart with new value;
    myChart.update();
    //If rotation>360 reset it back to 0
    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = 0;
    } else if (count > 15 && myChart.options.rotation == randomDegree) {
      valueGenerator(randomDegree);
      clearInterval(rotationInterval);
      count = 0;
      resultValue = 101;
    }
  }, 10);
});