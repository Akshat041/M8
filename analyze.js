// analyze.js
const fs = require("fs");

const filePath = "data.json";

// Step 1: Load events
let events = [];

try {
  const fileData = fs.readFileSync(filePath, "utf8");
  events = JSON.parse(fileData);
} catch (err) {
  console.log("No data found! Log some habits first.");
  process.exit(1);
}

if (events.length === 0) {
  console.log("No events yet. Log some habits first!");
  process.exit(1);
}

// Step 2: Calculate totals
const totals = {};
events.forEach((e) => {
  totals[e.habit] = (totals[e.habit] || 0) + e.minutes;
});

// Step 3: Display totals
console.log("📊 Total minutes by habit:");
for (let habit in totals) {
  console.log(`- ${habit}: ${totals[habit]} min`);
}

// Step 4: Find weakest habit
const sortedHabits = Object.entries(totals).sort((a, b) => a[1] - b[1]);
const weakestHabit = sortedHabits[0][0];

console.log(`\n🪫 Weakest habit: ${weakestHabit}`);

// Step 5: Suggest tiny action
console.log(`💡 Tiny Action: Do +5 minutes of ${weakestHabit} today.`);
