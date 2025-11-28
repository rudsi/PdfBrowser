import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import os from "os";

const app = express();
app.use(cors());

const ROOT_DIR = os.homedir();

app.get("/list-pdfs", (req, res) => {
  const relative = req.query.path || "";
    const fullPath = path.join(ROOT_DIR, relative);
    console.log("Trying to read:", fullPath);


  try {
    const files = fs.readdirSync(fullPath);
    const pdfs = files.filter(f => f.toLowerCase().endsWith(".pdf"));
    res.json({ pdfs });
  } catch (err) {
    res.status(404).json({ error: "Folder not found" });
  }
});

app.get("/files", (req, res) => {
  const relativeFile = req.query.path;
  if (!relativeFile) return res.status(400).send("Path required");

  const fullPath = path.join(ROOT_DIR, relativeFile);

  if (!fs.existsSync(fullPath))
    return res.status(404).send("File not found");

  res.sendFile(fullPath);
});

app.listen(5000, () =>
  console.log("Backend running on http://localhost:5000")
);
