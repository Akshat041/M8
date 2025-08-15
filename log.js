// log.js
const fs = require("fs");

// Step 1: Get arguments from the command line
// process.argv[0] = node, process.argv[1] = log.js, then your args start
const args = process.argv.slice(2);

// Expect: node log.js <habit> <minutes>
if (args.length < 2) {
  console.log("Usage: node log.js <habit> <minutes>");
  process.exit(1); // stop if not enough args
}

const habit = args[0];
const minutes = parseInt(args[1], 10);

if (isNaN(minutes)) {
  console.log("Minutes must be a number!");
  process.exit(1);
}

// Step 2: Read existing data
const filePath = "data.json";
let events = [];

try {
  const fileData = fs.readFileSync(filePath, "utf8");
  events = JSON.parse(fileData);
} catch (err) {
  console.log("No existing log found, starting fresh...");
}

// Step 3: Add new event
const newEvent = {
  date: new Date().toISOString(),
  habit: habit,
  minutes: minutes,
};

events.push(newEvent);

// Step 4: Save back to file
fs.writeFileSync(filePath, JSON.stringify(events, null, 2));

console.log(
  `✅ Logged: ${minutes} min of ${habit} on ${new Date().toLocaleString()}`
);
