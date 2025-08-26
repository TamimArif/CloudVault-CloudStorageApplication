import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  // Credentials will be picked from ENV or IAM Role automatically
});

async function uploadToS3(file) {
  const fileKey = `${uuidv4()}-${file.originalname}`;
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype || "application/octet-stream",
  };
  await s3.send(new PutObjectCommand(params));
  return {
    key: fileKey,
    url: `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
  };
}

async function deleteFromS3ByKey(key) {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
    })
  );
}

export const uploadFile = async (req, res) => {
  try {
    const db = req.db;
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const { key, url } = await uploadToS3(file);

    // Insert metadata into SQLite
    const result = await db.run(
      "INSERT INTO files (originalname, filename, mimetype, size, url, uploadedAt) VALUES (?, ?, ?, ?, ?, datetime('now'))",
      [file.originalname, key, file.mimetype || "", file.size || 0, url]
    );

    // Fetch the newly inserted row
    const inserted = await db.get("SELECT * FROM files WHERE id = ?", [result.lastID]);

    // Return full file row so frontend can update instantly
    res.json(inserted);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message || "Upload failed" });
  }
};

export const listFiles = async (req, res) => {
  try {
    const db = req.db;
    const rows = await db.all("SELECT * FROM files ORDER BY uploadedAt DESC");
    res.json(rows);
  } catch (err) {
    console.error("List error:", err);
    res.status(500).json({ error: err.message || "Fetch failed" });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const db = req.db;
    const id = req.params.id;

    const file = await db.get("SELECT * FROM files WHERE id = ?", [id]);
    if (!file) return res.status(404).json({ error: "File not found" });

    const key = file.filename || file.url.split("/").pop(); // prefer stored key
    await deleteFromS3ByKey(key);
    await db.run("DELETE FROM files WHERE id = ?", [id]);

    res.json({ message: "File deleted", id });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: err.message || "Delete failed" });
  }
};
