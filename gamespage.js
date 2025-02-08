const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");

// Timer display
const timerDisplay = document.createElement("p");
timerDisplay.style.textAlign = "center";
timerDisplay.style.fontSize = "1.2em";
timerDisplay.style.color = "#FF0000"; // Red color for visibility
finalValue.parentNode.insertBefore(timerDisplay, finalValue.nextSibling);

// Object that stores values of minimum and maximum angle for a value
const rotationValues = [
  { minDegree: 0, maxDegree: 30, value: "100🪙" },
  { minDegree: 31, maxDegree: 90, value: "500🪙" },
  { minDegree: 91, maxDegree: 150, value: "Orange Banner" },
  { minDegree: 151, maxDegree: 210, value: "1d Bump" },
  { minDegree: 211, maxDegree: 270, value: "Blue and Orange Banner" },
  { minDegree: 271, maxDegree: 330, value: "200🪙" },
  { minDegree: 331, maxDegree: 360, value: "100🪙" },
];

// Size of each piece
const data = [16, 16, 16, 16, 16, 16];

// Background color for each piece
const pieColors = [
  "#FF6F00", "#FFA726", "#FF6F00", "#FFA726", "#FF6F00", "#FFA726",
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
        borderColor: "#008080",
        borderWidth: 4,
      },
    ],
  },
  options: {
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      tooltip: false,
      legend: { display: false },
      datalabels: {
        color: "#ffffff",
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 18 },
        anchor: "center",
        align: "center",
      },
    },
  },
});

// Check if user has already spun today
const checkSpinEligibility = () => {
  const lastSpin = localStorage.getItem("lastSpinTime");
  if (lastSpin) {
    const lastSpinTime = new Date(parseInt(lastSpin));
    const now = new Date();
    const timeDiff = now - lastSpinTime;
    const hoursPassed = timeDiff / (1000 * 60 * 60);

    if (hoursPassed < 24) {
      spinBtn.disabled = true;
      updateTimer(lastSpinTime);
      return false;
    }
  }
  return true;
};

// Update the countdown timer
const updateTimer = (lastSpinTime) => {
  const interval = setInterval(() => {
    const now = new Date();
    const timeDiff = 24 * 60 * 60 * 1000 - (now - lastSpinTime);
    
    if (timeDiff <= 0) {
      clearInterval(interval);
      spinBtn.disabled = false;
      timerDisplay.innerHTML = "";
      return;
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    timerDisplay.innerHTML = `Next spin available in: ${hours}h ${minutes}m ${seconds}s`;
  }, 1000);
};

// Display the correct reward
const valueGenerator = (angleValue) => {
  for (let i of rotationValues) {
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      finalValue.innerHTML = `<p>Value: ${i.value}</p>`;
      spinBtn.disabled = true;
      localStorage.setItem("lastSpinTime", new Date().getTime());
      updateTimer(new Date());
      break;
    }
  }
};

// Start spinning
let count = 0;
let resultValue = 101;

spinBtn.addEventListener("click", () => {
  if (!checkSpinEligibility()) return;

  spinBtn.disabled = true;
  finalValue.innerHTML = `<p>Good Luck!</p>`;
  let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);

  let rotationInterval = window.setInterval(() => {
    myChart.options.rotation = myChart.options.rotation + resultValue;
    myChart.update();

    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = 0;
    } else if (count > 15 && myChart.options.rotation == randomDegree) {
      clearInterval(rotationInterval);
      valueGenerator(randomDegree);
      count = 0;
      resultValue = 101;
    }
  }, 10);
});

// Initialize spin button state on page load
checkSpinEligibility();