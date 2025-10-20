import "dotenv/config.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";

const app = express();

// CORS (ajustá el origin a donde sirvas el frontend)
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/", (_, res) => res.json({ ok: true }));

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

const port = process.env.PORT || 4000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB conectado");
    app.listen(port, () => console.log(`API escuchando en http://localhost:${port}`));
  })
  .catch(err => {
    console.error("Error conectando a MongoDB", err);
    process.exit(1);
  });
