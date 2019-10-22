const express = require("express");
const app = express();

app.use(express.json());

app.get("/test_one", (req, res) => {
  const message = {
    message: {
      fruitMessage: req.query.fruit,
      cakeMessage: req.query.cake
    }
  };
  res.json(message);
});

app.post("/test_two", (req, res) => {
  const { fruit, cake } = req.body;
  res.json({ massage: { fruitMessage: `i love to eat ${fruit} with ${cake}` } });
});

app.get("/test_three/", (req, res) => {});

app.post("/test_four", (req, res) => {});

app.put("/test_five/write", (req, res) => {});

app.listen(3000, () => console.log("server is running"));