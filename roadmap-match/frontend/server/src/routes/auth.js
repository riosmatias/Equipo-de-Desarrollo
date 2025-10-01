import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

/** POST /api/auth/register */
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Email y password requeridos" });
    if (password.length < 6 || password.length > 64) {
      return res.status(400).json({ error: "La contraseña debe tener entre 6 y 64 caracteres" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "Ese email ya está registrado" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (e) {
    res.status(500).json({ error: "Error en registro" });
  }
});

/** POST /api/auth/login */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "No existe una cuenta con ese email" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch {
    res.status(500).json({ error: "Error en login" });
  }
});

/** POST /api/auth/reset-password */
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body || {};
    if (!email || !newPassword) return res.status(400).json({ error: "Email y nueva contraseña requeridos" });
    if (newPassword.length < 6 || newPassword.length > 64) {
      return res.status(400).json({ error: "La nueva contraseña debe tener entre 6 y 64 caracteres" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "No existe una cuenta con ese email" });

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;
    await user.save();

    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Error al restablecer la contraseña" });
  }
});

/** GET /api/auth/me (protegido) */
router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select("_id email createdAt");
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
  res.json({ user });
});

export default router;
