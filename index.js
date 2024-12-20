require("dotenv").config();
const express = require("express");
const package = require("./package.json");
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const sequelize = require("./src/config/sequelize");
const routes = require("./src/routes/index.routes");
const chatControllers = require("./src/modules/chats/chats.controllers");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 3000;

// Membuat direktori uploads jika belum ada
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const minioClient = require("./src/config/minio");

// Fungsi untuk memeriksa koneksi ke Minio
const cekKoneksiMinio = async () => {
  try {
    console.log("cek koneksi minio");
    const result = await minioClient.listBuckets();
    console.log({ result });
    console.log("Koneksi ke Minio berhasil.");
  } catch (error) {
    console.error("Gagal terhubung ke Minio:", error);
  }
};

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
  cekKoneksiMinio();
});

// Konfigurasi Socket.IO
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send_message", (data) => {
    // console.log("Message received:", data);
    chatControllers.insertChat(data);
    io.emit(`message_${data.to}`, data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Jalankan Server
server.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
