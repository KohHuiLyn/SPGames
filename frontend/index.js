//Admission Number: P2021672
//Name: Koh Hui Lyn
//Class: 1B05
const express = require("express");
const app = express();

//making public folder public
app.use(express.static('public'))

app.get("/home.html", (req, res) => {
  res.sendFile("/public/home.html", { root: __dirname });
});

app.get("/users/:id", (req, res) => {
  res.sendFile("/public/user.html", { root: __dirname });
});

app.get("/login.html", (req, res) => {
  res.sendFile("/public/login.html", { root: __dirname });
});

app.get("/gameDesc/:id", (req, res) => {
  res.sendFile("/public/gameDesc.html", { root: __dirname });
});

app.use((req,res) => {
  res.sendFile("/public/home.html", { root: __dirname });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Client server has started listening in http://localhost:${PORT}`);
});
