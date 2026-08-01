const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, "database.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/registrations", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  res.json(data);
});

app.post("/register", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));

  data.push({
    name: req.body.name,
    phone: req.body.phone,
    age: req.body.age,
    gender: req.body.gender,
    loanAmount: req.body.loanAmount,
    duration: req.body.duration,
    interestRate: "0.1%",
    status: "Approved",
    date: new Date().toLocaleString()
  });

  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Loan Application</title>
<style>
body{
  font-family:Arial,sans-serif;
  background:#f5f5f5;
  display:flex;
  justify-content:center;
  align-items:center;
  height:100vh;
  margin:0;
}
.card{
  background:white;
  padding:30px;
  border-radius:10px;
  text-align:center;
  max-width:400px;
  box-shadow:0 2px 10px rgba(0,0,0,.2);
}
button{
  background:#1877F2;
  color:white;
  border:none;
  padding:12px 20px;
  border-radius:5px;
  cursor:pointer;
}
</style>
</head>
<body>

<div class="card">
<h2>Loan Application Approved</h2>

<p>Dear ${req.body.name},</p>

<p>Your loan application has been approved.</p>

<p>To continue with the next steps, please message us on our Facebook page.</p>

<button onclick="window.location='/'">Done</button>

</div>

</body>
</html>
  `);
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
  console.error("SERVER ERROR:", err);
});
