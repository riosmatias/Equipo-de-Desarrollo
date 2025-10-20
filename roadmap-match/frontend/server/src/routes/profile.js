import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

import bcrypt from "bcryptjs";

const router = Router();

// === Configurar almacenamiento con multer ===
const uploadDir = path.join(process.cwd(), "uploads");

// Crear la carpeta "uploads" si no existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Genera un nombre único para evitar sobrescribir archivos
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB en bytes
  fileFilter: (req, file, cb) => {
    // Opcional: limitar solo a imágenes
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Solo se permiten imágenes"));
    }
    cb(null, true);
  },
});

// === Ruta para actualizar perfil ===
router.patch("/update", requireAuth, (req, res) => {
  const uploadSingle = upload.single("imagen"); // tu multer

  uploadSingle(req, res, async function (err) {
    if (err) {
      if (err instanceof multer.MulterError) {
        // error de multer (archivo muy grande)
        return res
          .status(400)
          .json({ error: "La imagen no puede superar 1 MB" });
      }
      // otro error
      return res.status(500).json({ error: "Error al subir la imagen" });
    }

    try {
      // tu código de actualización de perfil
      const { nickname, nombre, apellido, email, password } = req.body;
      const user = await User.findById(req.user.id);
      if (!user)
        return res.status(404).json({ error: "Usuario no encontrado" });

      if (password) user.passwordHash = await bcrypt.hash(password, 10);
      if (nickname) user.nickname = nickname;
      if (nombre) user.nombre = nombre;
      if (apellido) user.apellido = apellido;
      if (email) user.email = email;

      if (req.file) {
        user.fotoPerfil = `/uploads/${req.file.filename}`;
      }

      await user.save();
      res.json({ ok: true, user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al actualizar el perfil" });
    }
  });
});

//GEEET
// === Obtener datos del usuario logueado ===
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ ok: true, user });
  } catch (err) {
    console.error("Error al traer datos del usuario:", err);
    res.status(500).json({ error: "Error al traer datos del usuario" });
  }
});

// === DELETE===
router.delete("/delete", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    await user.deleteOne(); // elimina el documento de MongoDB

    res.json({ ok: true, message: "Perfil eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar perfil:", error);
    res.status(500).json({ error: "Error al eliminar el perfil" });
  }
});

export default router;
// Contraseña10
