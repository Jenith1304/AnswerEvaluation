// controllers/seedController.js
const Subject = require("../models/Subject");
const Standard = require("../models/Standard");
const Section = require("../models/Section");

async function seedDatabase(req, res) {
  try {
    // Optional: Protect this route in production with middleware (auth/admin check)
    // if (process.env.NODE_ENV !== "development") {
    //   return res.status(403).json({ message: "Seeding allowed only in development." });
    // }

    // Clear existing data
    await Subject.deleteMany({});
    await Standard.deleteMany({});
    await Section.deleteMany({});

    // Insert subjects
    const subjects = await Subject.insertMany([
      { subject_name: "MATHEMATICS" },
      { subject_name: "SCIENCE" },
      { subject_name: "ENGLISH" },
      { subject_name: "SOCIAL SCIENCE" },
      { subject_name: "HINDI" }
    ]);

    // Create standards with linked subjectIds
    const std9 = await Standard.create({
      standard: "9th",
      subjects: subjects.map(sub => ({ subjectId: sub._id }))
    });

    const std10 = await Standard.create({
      standard: "10th",
      subjects: subjects.map(sub => ({ subjectId: sub._id }))
    });

    // Create sections for each standard
    await Section.insertMany([
      { name: "A", standard: std9._id },
      { name: "B", standard: std9._id },
      { name: "A", standard: std10._id },
      { name: "B", standard: std10._id }
    ]);

    res.status(200).json({ message: "✅ Database seeded successfully" });
  } catch (err) {
    console.error("Seeding error:", err);
    res.status(500).json({ message: "❌ Seeding failed", error: err.message });
  }
}

module.exports = { seedDatabase };
