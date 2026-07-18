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
console.log(req.body);
  const data = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));

  data.push({
    name: req.body.name,
    phone: req.body.phone,
    age: req.body.age,
    gender: req.body.gender,
    date: new Date().toLocaleString()
  });

  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

  const message =
`Hello, I have registered.

Name: ${req.body.name}
Phone: ${req.body.phone}
Age: ${req.body.age}
Gender: ${req.body.gender}`;

  res.redirect(
    "https://wa.me/254108899231?text=" +
    encodeURIComponent(message)
  );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
