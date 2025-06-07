const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "A", "B"
    standard: { type: mongoose.Schema.Types.ObjectId, ref: "Standard", required: true }
});

SectionSchema.index({ name: 1, standard: 1 }, { unique: true });
const Section = mongoose.model("Section", SectionSchema);
module.exports = Section