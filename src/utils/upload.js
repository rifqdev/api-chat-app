const multer = require("multer");
const path = require("path");
const fs = require("fs");

const minioClient = require("../config/minio");

const checkAndCreateBucket = async (bucketName) => {
  try {
    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      await minioClient.makeBucket(bucketName);
      console.log(`Bucket "${bucketName}" successfully created.`);
    }
    return true;
  } catch (error) {
    console.error(`Failed to check or create bucket "${bucketName}":`, error);
    throw error;
  }
};

const uploadToMinio = async (bucketName, filePath, originalname) => {
  await checkAndCreateBucket(bucketName);
  const fileStream = fs.createReadStream(filePath);
  const fileSize = fs.statSync(filePath).size;
  const uniqueOriginalName = `${Date.now()}_${originalname}`;

  return new Promise((resolve, reject) => {
    minioClient.putObject(bucketName, uniqueOriginalName, fileStream, fileSize, (err, etag) => {
      if (err) {
        fs.unlinkSync(filePath);
        reject({ message: "Gagal", errorDetail: err });
      } else {
        fs.unlinkSync(filePath);
        resolve({
          url: `${bucketName}/${uniqueOriginalName}`,
          id: etag,
        });
      }
    });
  });
};

const deleteFile = async (bucketName, fileName) => {
  try {
    await minioClient.removeObject(bucketName, fileName);
    console.log({ message: "Berhasil menghapus file" });
  } catch (error) {
    console.error("Kesalahan menghapus file:", error);
    throw error;
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

module.exports = { upload, uploadToMinio, deleteFile };
