const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");

// Object that stores values of minimum and maximum angle for a value
const rotationValues = [
  { minDegree: 0, maxDegree: 60, value: "100🪙" }, // 1st segment (60 degrees)
  { minDegree: 61, maxDegree: 120, value: "500🪙" }, // 2nd segment
  { minDegree: 121, maxDegree: 180, value: "Orange Banner" }, // 3rd segment
  { minDegree: 181, maxDegree: 240, value: "1d Bump" }, // 4th segment
  { minDegree: 241, maxDegree: 300, value: "Blue and Orange Banner" }, // 5th segment
  { minDegree: 301, maxDegree: 360, value: "200🪙" }, // 6th segment
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
    labels: ["100🪙", "500🪙", "⍰ Banner", "1d Bump", "2X⍰Banner", "200🪙"],
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

// Display value based on the randomAngle
const valueGenerator = (angleValue) => {
  for (let i of rotationValues) {
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      finalValue.innerHTML = `<p>You won: ${i.value}! 🎉</p>`;
      spinBtn.disabled = false;
      break;
    }
  }
};

// Spinner count
let count = 0;
// 100 rotations for animation and last rotation for result
let resultValue = 101;

// Start spinning
spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  finalValue.innerHTML = `<p>Good Luck!</p>`; // Empty final value
  const randomDegree = Math.floor(Math.random() * 360); // Generate random degrees to stop at
  const rotationInterval = window.setInterval(() => {
    myChart.options.rotation += resultValue; // Set rotation for piechart
    myChart.update(); // Update chart with new value

    // Reset rotation if > 360
    if (myChart.options.rotation >= 360) {
      count++;
      resultValue -= 5;
      myChart.options.rotation = 0;
    } else if (count > 15 && myChart.options.rotation === randomDegree) {
      valueGenerator(randomDegree);
      clearInterval(rotationInterval);
      count = 0;
      resultValue = 101;
    }
  }, 10);
});
