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

// Group by habit
const habits = {};
events.forEach((e) => {
  if (!habits[e.habit]) habits[e.habit] = [];
  habits[e.habit].push({
    date: e.date.split("T")[0], // only keep YYYY-MM-DD
    minutes: e.minutes,
  });
});

// Helper: get unique dates sorted
function getSortedDates(entries) {
  const dates = [...new Set(entries.map((e) => e.date))];
  return dates.sort();
}

// Helper: calculate streak
function calcStreak(entries, target) {
  const dates = getSortedDates(entries);
  let streak = 0;
  let today = new Date();

  for (let i = dates.length - 1; i >= 0; i--) {
    let dateObj = new Date(dates[i]);
    let diffDays = Math.floor((today - dateObj) / (1000 * 60 * 60 * 24));
    if (diffDays !== dates.length - 1 - i) break; // break if gap

    // Sum minutes for that date
    const totalForDate = entries
      .filter((e) => e.date === dates[i])
      .reduce((sum, e) => sum + e.minutes, 0);

    if (totalForDate >= target) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// Helper: 7-day average
function calc7DayAverage(entries) {
  const today = new Date();
  const last7Days = [];

  for (let i = 0; i < 7; i++) {
    let dateStr = new Date(today - i * 86400000).toISOString().split("T")[0];
    let total = entries
      .filter((e) => e.date === dateStr)
      .reduce((sum, e) => sum + e.minutes, 0);
    last7Days.push(total);
  }

  const avg = last7Days.reduce((a, b) => a + b, 0) / 7;
  return avg.toFixed(1);
}

// Show analysis
console.log("📊 Habit Stats:");
for (let habit in habits) {
  const total = habits[habit].reduce((sum, e) => sum + e.minutes, 0);
  console.log(`\n${habit.toUpperCase()}:`);
  console.log(`  Total: ${total} min`);
  console.log(
    `  Streak: ${calcStreak(habits[habit], 20)} days (target 20 min)`
  );
  console.log(`  7-Day Average: ${calc7DayAverage(habits[habit])} min/day`);
}

// Find weakest habit by total
const totals = Object.entries(habits).map(([habit, entries]) => {
  const total = entries.reduce((sum, e) => sum + e.minutes, 0);
  return [habit, total];
});
totals.sort((a, b) => a[1] - b[1]);

if (totals.length > 0) {
  const weakestHabit = totals[0][0];
  console.log(`\n🪫 Weakest habit: ${weakestHabit}`);
  console.log(`💡 Tiny Action: Do +5 minutes of ${weakestHabit} today.`);
}
