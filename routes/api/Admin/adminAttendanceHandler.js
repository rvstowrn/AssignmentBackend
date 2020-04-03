const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const config = require("config");
const jwt = require("jsonwebtoken");
const Attendance = require("../../../models/Attendance/Attendance");

// @route   POST api/admin/createAttendance
// @desc    Creates Attendance details for 
// @access  Public
router.post("/createAttendance",
 [
    check("sectionName", "Include Section Name")
      .not()
      .isEmpty(),
    check("teacherName", "Include Teacher Id")
      .not()
      .isEmpty(),
    check("date", "Include Date")
      .not()
      .isEmpty(),
    check("attendanceDetails", "Include Attendance Details")
      .not()
      .isEmpty()  
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { sectionName,teacherName,date,attendanceDetails }=req.body;
    try {
    // See if Attendance already exist
    let attendance = await Attendance.find({ sectionName,teacherName,date });
    if (attendance.length) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Attendance for given constraints already exists" }] });
    }
    attendance = new Attendance({ sectionName,teacherName,date,attendanceDetails });
    await attendance.save();
    return res.send("attendance added successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/admin/updateHomeworks
// @desc    Updates a Homework for a given day and subject
// @access  Public
router.post("/updateAttendance",
  [
    check("_id", "Include Attendance Id")
      .not()
      .isEmpty(),  
    check("sectionName", "Include Section Name")
      .not()
      .isEmpty(),
    check("teacherName", "Include Teacher Id")
      .not()
      .isEmpty(),
    check("date", "Include Date")
      .not()
      .isEmpty(),
    check("attendanceDetails", "Include Attendance Details")
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
    teacherName,
    date,
    attendanceDetails,
  } = req.body;
  try {
    let attendance = await Attendance.findByIdAndUpdate({ _id }, { sectionName,teacherName,date,attendanceDetails });
    if (attendance) {
      return res.send("attendance updated successfully");
    } else {
      return res.send("No attendance to be updated for given id");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/admin/deleteAttendance
// @desc    Deletes Attendance for given id
// @access  Public
router.delete("/deleteAttendance/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // See if Attendance Exists
    let attendance = await Attendance.findById(id);
    if (attendance) {
      attendance.deleteOne();
      return res.send("attendance deleted successfully");
    } else {
      return res.send("No attendance to be deleted for given id");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/admin/readAttendance
// @desc    Read Attendance with or without filter(s)
// @access  Public

router.get("/readAttendance", async (req, res) => {
  try {
    let qdata = req.query;

    // See if Attendance Exist
    let attendance = await Attendance.find(qdata).populate('teacherName');
    if (attendance.length) {
      res.send(attendance);
    } else {
      return res.send("No attendance found for given constraints");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


module.exports = router;
