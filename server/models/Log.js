import mongoose from "mongoose"

const logSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  cigarettes: {
    type: Number,
    default: 0,
    min: 0,
  },
  smokeless: {
    type: Number,
    default: 0,
    min: 0,
  },
  notes: {
    type: String,
    default: "",
  },
  craving: {
    type: Number,
    default: 0,
    min: 0,
    max: 10,
  },
  mood: {
    type: String,
    default: "",
  },
  moneySaved: {
    type: Number,
    default: 0,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Index for faster queries
logSchema.index({ userId: 1, date: -1 })

export default mongoose.model("Log", logSchema)
