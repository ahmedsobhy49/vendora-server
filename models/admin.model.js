import { Schema, model } from "mongoose";

const adminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  image: { type: String },
  role: { type: String, default: "admin" },
});

const adminModel = model("admins", adminSchema);
export default adminModel;
