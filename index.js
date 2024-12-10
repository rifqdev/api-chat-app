const express = require("express");
const package = require("./package.json");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;

const sequelize = require("./src/config/sequelize");
const routes = require("./src/routes/index.routes");

sequelize.testConnection();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

app.use(cors({ origin: process.env.FRONTEND_URL }));

app.use("/", (req, res) => {
  res.json({
    app: package.name,
    status: "success",
    message: "Server running properly",
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
