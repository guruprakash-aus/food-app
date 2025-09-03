const express = require("express");
const authRoutes = require("./routes/authRoutes");

const app = express();

const PORT = process.env.PORT || 9000;

app.use(express.json());

app.use("/auth", authRoutes);

app.use("/health", (req, res) => {
  res.status(200).send("OK");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
