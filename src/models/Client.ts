import mongoose from "mongoose";

// Client Schema
const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  currentPrograms: [{ type: String }], // Array of program names (e.g. 'Knee Rehabilitation')
  coach: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Referring to the User collection for the coach
  note: { type: String, default: "" }, // Any specific note about the client
  createdAt: { type: Date, default: Date.now }, // Automatically set to current date/time when the client is created
});

// Ensuring the createdAt field is always populated with the current date/time
export default mongoose.models.Client || mongoose.model("Client", ClientSchema);