import mongoose from "mongoose";

// Program Schema
const ProgramSchema = new mongoose.Schema({
  name: { type: String, required: true },
  coach: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Referring to the User collection for the coach
  type: { type: String, required: true }, // Program type (e.g., Rehab, Fitness, etc.)
  durationWeeks: { type: Number, required: true }, // Duration in weeks
  clients: [{ type: String }], // Array of client names or could reference ObjectId of clients
  sessions: [
    {
      id: { type: String, required: true },
      date: { type: Date, required: true },
      exercises: [
        {
          id: { type: String, required: true },
          name: { type: String, required: true },
          description: { type: String, required: true },
        },
      ],
    },
  ],
  createdAt: { type: Date, default: Date.now }, // Automatically set to current date/time when the program is created
});

// Ensure Program model is created only once
export default mongoose.models.Program || mongoose.model("Program", ProgramSchema);
