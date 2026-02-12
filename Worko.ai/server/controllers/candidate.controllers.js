const Candidate = require("../models/Candidate");

exports.create = async (req, res) => {
  try {
    const { name, email, phone, jobTitle } = req.body;

    if (!name || !email || !phone || !jobTitle) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const candidate = await Candidate.create({
      name,
      email,
      phone,
      jobTitle,
      resumeUrl: req.file?.path || "no-resume",
      createdBy: req.userId
    });

    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const list = await Candidate.find({ createdBy: req.userId }).sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ _id: req.params.id, createdBy: req.userId });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found or unauthorized" });
    }

    candidate.status = req.body.status;
    await candidate.save();

    res.json({ message: "Status updated successfully", candidate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const candidate = await Candidate.findOneAndDelete({ _id: req.params.id, createdBy: req.userId });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found or unauthorized" });
    }

    res.json({ message: "Candidate deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};