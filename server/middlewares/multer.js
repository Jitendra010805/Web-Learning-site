import multer from "multer";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";
import os from "os";

const isVercel = process.env.VERCEL === "1" || !!process.env.VERCEL;
const uploadDir = isVercel ? path.join(os.tmpdir(), "uploads") : "uploads";

// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const id = uuid();
    const extName = file.originalname.split(".").pop();
    const fileName = `${id}.${extName}`;
    cb(null, fileName);
  },
});

// ✅ Export middleware function
export const uploadFiles = multer({ storage }).single("file");
