const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const config = require("config");
const jwt = require("jsonwebtoken");
const Attendance = require("../../../models/Attendance/Attendance");
const Student = require("../../../models/Users/Student");

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





// @route   Read api/admin/viewSectionAttendance/:id
// @desc    Gets Attendance for a given section
// @access  Public
router.get("/viewSectionAttendance/:sectionName/:month",
  async (req, res) => {
  const { sectionName,month } = req.params;

  try {
    // See if Attendance Exists
    let attendance = await Attendance.find({sectionName:sectionName,"date": {"$gte": new Date(2019,parseInt(month), 1), "$lt": new Date(2019,parseInt(month), 31)}});
    if (attendance.length) {
      var obs={};
      var obj={};
      var totalDates = attendance.length; 
      for(let i=0;i<attendance.length;i++){
        let {date, attendanceDetails} = attendance[i];
        obj[date] = {};
        for(let j=0;j<attendanceDetails.length;j++){
          obj[date][attendanceDetails[j].student] = attendanceDetails[j].status;
          if(attendanceDetails[j].status == "present")
          obs[attendanceDetails[j].student] = (obs[attendanceDetails[j].student] || 0) + 1;
          else
          obs[attendanceDetails[j].student] = (obs[attendanceDetails[j].student] || 0);  
        }
      }
      return res.send({datestudentobj:obj,studentobj:obs,total:totalDates});
    } else {
      return res.send("No attendance to be shown");
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// @route   Read api/admin/viewStudentAttendance/:studentName
// @desc    Gets Attendance for a given student and dates
// @access  Public
router.get("/viewStudentAttendance/:studentName",
  async (req, res) => {

  const { studentName } = req.params;

  try {
    // See if Attendance Exists
    let student = await Student.findById(studentName); 
    let sectionName = student.sectionName;
    let attendance = await Attendance.find({sectionName:sectionName});
    if (attendance) {

      var obj={};
      var obm={};
      var totalDaysAMonth={};

      for(let i=0;i<attendance.length;i++){
        let { date,attendanceDetails } = attendance[i];
        let s = attendanceDetails.find((el)=>{return el.student == studentName});;
        totalDaysAMonth[date.getMonth()] = (totalDaysAMonth[date.getMonth()] || 0)+1;
        obj[date] = s.status;
        if(s.status=="present")         
        obm[date.getMonth()] = (obm[date.getMonth] || 0)+1;
        else
        obm[date.getMonth()] = (obm[date.getMonth] || 0);  
      }
      return res.send({perdate:obj,permonth:obm,totalDaysAMonth:totalDaysAMonth});
    } else {
      return res.send("No attendance to be shown");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


module.exports = router;
