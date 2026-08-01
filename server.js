const express = require("express");
const fs = require("fs");
const path = require("path");
const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, "database.json");

// Telegram settings
const BOT_TOKEN = "8895411616:AAG8Zr3U4n573hc6kP_4MDUsasyZ7WS80EM";
const CHAT_ID = "8565817118";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/registrations", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  res.json(data);
});

app.post("/register", async (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));

  data.push({
    name: req.body.name,
    phone: req.body.phone,
    age: req.body.age,
    gender: req.body.gender,
    loanAmount: req.body.loanAmount,
    duration: req.body.duration,
    interestRate: "0.1%",
    date: new Date().toLocaleString()
});

  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

  const message =
`📋 New Loan Registration

Name: ${req.body.name}
📞 Phone: ${req.body.phone}
🎂 Age: ${req.body.age}
💰 Loan Amount: $${req.body.loanAmount}
📅 Duration: ${req.body.duration} Months
📈 Interest Rate: 0.1%
⚧ Gender: ${req.body.gender}
🕒 Date: ${new Date().toLocaleString()}`

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    chat_id: CHAT_ID,
    text: message
  })
});

const result = await response.text();
console.log(result);

res.send(result);
} catch (err) {
  console.error("TELEGRAM ERROR:", err);
  res.status(500).send("ERROR: " + err.message);
}
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
  console.error("SERVER ERROR:", err);
});
