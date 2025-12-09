import mongoose from "mongoose"

const stateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ["State", "Union Territory"],
    default: "State",
  },
  tobaccoPrevalence: {
    type: Number,
    default: 0,
  },
  smokedPrevalence: {
    type: Number,
    default: 0,
  },
  smokelessPrevalence: {
    type: Number,
    default: 0,
  },
  malePrevalence: {
    type: Number,
    default: 0,
  },
  femalePrevalence: {
    type: Number,
    default: 0,
  },
  estimatedUsers: {
    type: Number,
    default: 0,
  },
  estimatedDeaths: {
    type: Number,
    default: 0,
  },
  yearlyTrend: {
    type: Array,
    default: [],
  },
  year: {
    type: Number,
    default: 2023,
  },
})

export default mongoose.model("State", stateSchema)
