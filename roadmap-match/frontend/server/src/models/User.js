import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },

    // Campos nuevos para poder actualziarlos en perfil
    nombre: { type: String, trim: true },
    nickname: { type: String, trim: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    fotoPerfil: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
