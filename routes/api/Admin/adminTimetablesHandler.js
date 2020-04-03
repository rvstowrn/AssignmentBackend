const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const config = require("config");
const jwt = require("jsonwebtoken");
const Timetable = require("../../../models/Timetables/Timetables");

// @route   POST api/admin/createTimetable
// @desc    Creates Timetable with express-validator 
// @access  Public
router.post("/createTimetable",
  [
    check("sectionName", "Include Section Id")
      .not()
      .isEmpty(),
    check("releaseDate", "Include Release Date")
      .not()
      .isEmpty(),
    check("timetableDetails", "Include Timetable Details")
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { sectionName,releaseDate,timetableDetails }=req.body;
    try {
    // See if TimeTable already exist
    let timetable = await Timetable.find({ sectionName,releaseDate });
    if (timetable.length) {
      return res
        .status(400)
        .json({ errors: [{ msg: "timetable for given constraints already exists" }] });
    }
    timetable = new Timetable({ sectionName,releaseDate,timetableDetails });
    await timetable.save();
    return res.send("timetable added successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/admin/updateTimetable
// @desc    Updates a Homework for a given day and subject
// @access  Public
router.post("/updateTimetable",
  [
    check("_id", "Include Timetable Id")
      .not()
      .isEmpty(),  
    check("sectionName", "Include Section Name")
      .not()
      .isEmpty(),
    check("releaseDate", "Include Release Date")
      .not()
      .isEmpty(),
    check("timetableDetails", "Include timeTable Details")
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  const { 
    _id,
    sectionName,
    releaseDate,
    timetableDetails,
  } = req.body;
  try {
    let timetable = await Timetable.findByIdAndUpdate({ _id }, { sectionName,releaseDate,timetableDetails});
    if (timetable) {
      return res.send("timetable updated successfully");
    } else {
      return res.send("No timetable to be updated for given id");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/admin/deleteTimetable
// @desc    Deletes Timetable for given id
// @access  Public
router.delete("/deleteTimetable/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // See if Attendance Exists
    let timetable = await Timetable.findById(id);
    if (timetable) {
      timetable.deleteOne();
      return res.send("timetable deleted successfully");
    } else {
      return res.send("No timetable to be deleted for given id");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/admin/readTimetable
// @desc    Read Timetable with or without filter(s)
// @access  Public

router.get("/readTimetable", async (req, res) => {
  try {
    let qdata = req.query;

    // See if Attendance Exist
    let timetable = await Timetable.find(qdata);
    if (timetable.length) {
      res.send(timetable);
    } else {
      return res.send("No timetable found for given constraints");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
