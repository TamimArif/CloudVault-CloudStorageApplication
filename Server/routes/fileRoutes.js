import express from "express";
import multer from "multer";
import { uploadFile, listFiles, deleteFile } from "../controllers/fileController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), uploadFile);
router.get("/", listFiles);
router.delete("/:id", deleteFile);

export default router;
