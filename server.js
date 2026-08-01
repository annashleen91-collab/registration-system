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
    date: new Date().toLocaleString()
  });

  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Application Submitted</title>
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
          background:#fff;
          padding:30px;
          border-radius:10px;
          text-align:center;
          box-shadow:0 2px 10px rgba(0,0,0,.2);
        }
        a{
          display:inline-block;
          margin-top:20px;
          background:#25D366;
          color:#fff;
          padding:10px 20px;
          text-decoration:none;
          border-radius:5px;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>✅ Application Submitted Successfully</h2>
        <p>Your loan application has been received.</p>
        <a href="/">Submit Another Application</a>
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
