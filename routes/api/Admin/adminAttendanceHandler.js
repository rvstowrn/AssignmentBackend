const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const config = require("config");
const jwt = require("jsonwebtoken");
const Attendance = require("../../../models/Attendance/Attendance");
const Student = require("../../../models/Users/Student");
const Teacher = require("../../../models/Users/Teacher");

// @route   POST api/admin/createAttendance
// @desc    Creates Attendance for given date and section 
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
    // Check if section,teacher and students exist with student belonging to given section       
    //Check teacher authority  

    // See if Attendance already exist
    let attendance = await Attendance.find({ sectionName,date });
    if (attendance.length) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Attendance for given section and date" }] });
    }
    attendance = new Attendance({ sectionName,teacherName,date,attendanceDetails });
    await attendance.save();
    return res.send("attendance added successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/admin/updateAttendance
// @desc    Updates an Attendance for a given day and subject
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
    // Check if section,teacher and students exist with student belonging to given section       
    // Do something to stop more docs in case of update param date and section already exist 

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
    //Only allow selected query params
    let qdata = req.query;

    // See if Attendance Exist
    let attendance = await Attendance.find(qdata).populate('teacherName');
    if (attendance.length) {
      res.send({attendances:attendance});
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
router.get("/viewSectionAttendance/:sectionName/:month/:academicYear",
  async (req, res) => {
  const { sectionName,month,academicYear } = req.params;

  try {
    // Check validity if sectionName and month spelling and academicYear validness
      
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    let attendancemod = await Attendance.find({sectionName});
    console.log(attendancemod);
    let attendances = attendancemod.filter(el => { return (el.date.getMonth() == months.indexOf(month) && el.date.getFullYear()==academicYear);});
    if (attendances || attendances.length) {
      var obj={};
      attendances[0].attendanceDetails.forEach(el=>{
        obj[el.student]=[];
      });

      attendances.forEach(attendance=>{
        let {date, attendanceDetails} = attendance;
        attendanceDetails.forEach(el=>{
          obj[el.student].push({date:date.getDate(),status:el.status});
        });
      });
      return res.send(obj);
    } else {
      return res.send("No attendance to be shown");
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


// @route   Read api/admin/viewAttendanceOfAcademicYear/:studentId/:academicYear
// @desc    Gets Attendance for a given student and academic year
// @access  Public
router.get("/viewAttendanceOfAcademicYear/:studentId/:academicYear",
  async (req, res) => {

  const { studentId, academicYear } = req.params;

  try {
    //Check student id existence and valid academic year
    
    let student = await Student.findById(studentId); 
    let sectionName = student.sectionName;
    let attendances = await Attendance.find({ sectionName });
    if (attendances.length) {
      var obj={"name":student.name};
      var month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      
      month.forEach(m => { 
        obj[m]=[]; 
      });
      
      attendances.forEach(attendance => {
        let { date,attendanceDetails } = attendance;
        let s = attendanceDetails.find((el)=>{return el.student == studentId});
        if(date.getFullYear() == academicYear)
        obj[month[date.getMonth()]].push({date:date.getDate(),status:s.status});
      });
      return res.send(obj);
    } else {
      return res.send("No attendance to be shown");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


module.exports = router;
