require("dotenv").config();
const express = require("express");
const package = require("./package.json");
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const sequelize = require("./src/config/sequelize");
const routes = require("./src/routes/index.routes");

const PORT = process.env.PORT || 3000;

// Buat HTTP Server
const server = http.createServer(app);

// Inisialisasi Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // URL Frontend
    methods: ["GET", "POST"],
  },
});

// Test koneksi ke database
sequelize.testConnection();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

// Endpoint Default
app.use("/", (req, res) => {
  res.json({
    app: package.name,
    status: "success",
    message: "Server running properly",
  });
});

// Konfigurasi Socket.IO
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send_message", (data) => {
    console.log("Message received:", data);

    io.emit(data.to, data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Jalankan Server
server.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
