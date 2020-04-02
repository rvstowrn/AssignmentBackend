const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const Attendance = require("../../../models/Attendance/Attendance");
const Teacher = require("../../../models/Users/Teacher");
const authTeacher = require("../../../middleware/authTeacher");



// @route   POST api/teacher/createAttendance
// @desc    Creates Attendance details 
// @access  Teacher
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
  authTeacher, 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { sectionName,teacherName,date,attendanceDetails }=req.body;
    try {
    // Check Teacher Authority
    let teacher = await Teacher.findById(req.user.user.id);
    let result = teacher.sectionAccess.find((el)=>{return el.sectionName==sectionName});
    if(!result){
      return res.status(404).json({ errors: "Unauthorized Access" });
    }

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
  authTeacher,
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
    // Check Teacher Authority
    let teacher = await Teacher.findById(req.user.user.id);
    let result = teacher.sectionAccess.find((el)=>{return el.sectionName==sectionName});
    if(!result){
      return res.status(404).json({ errors: "Unauthorized Access" });
    }

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
router.delete("/deleteAttendance/:id",authTeacher, 
  async (req, res) => {
  const { id } = req.params;

  try {
    // See if Attendance Exists
    let attendance = await Attendance.findById(id);
    if (attendance) {
      let teacher = await Teacher.findById(req.user.user.id);
      let result = teacher.sectionAccess.find((el)=>{return el.sectionName == attendance.sectionName.toString()});
      console.log(result);
      if(!result){
      return res.status(404).json({ errors: "Unauthorized Access" });
      }
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

router.get("/readAttendance",authTeacher,
 async (req, res) => {
  try {

    let qdata = req.query;

    // See if Attendance Exist
    let attendance = await Attendance.find(qdata);
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
router.get("/viewSectionAttendance/:sectionName",
  authTeacher, 
  async (req, res) => {
  const { sectionName } = req.params;

  try {
    // See if Attendance Exists
    let attendance = await Attendance.find({sectionName:sectionName});
    if (attendance) {
      let teacher = await Teacher.findById(req.user.user.id);
      let result = teacher.sectionAccess.find((el)=>{return el.sectionName == sectionName});
      if(!result){
      return res.status(404).json({ errors: "Unauthorized Access" });
      }

      var obj={};
      for(let i=0;i<attendance.length;i++){
        let date = attendance[i].date; 
        obj[date] = {};
        let attendanceDetails = attendance[i].attendanceDetails
        for(let j=0;j<attendanceDetails.length;j++){
          obj[date][attendanceDetails[j].student] = attendanceDetails[j].status;
        }
      }
      return res.send(obj);
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
router.get("/viewStudentAttendance/",
  authTeacher, 
  async (req, res) => {

  const { studentName, dates } = req.body;

  try {
    // See if Attendance Exists
    let student = await Student.findById({_id:studentName}); 
    let sectionName = student.sectionName;
    let attendance = await Attendance.find({sectionName:sectionName,date:{$in:dates}});
    if (attendance) {
      let teacher = await Teacher.findById(req.user.user.id);
      let result = teacher.sectionAccess.find((el)=>{return el.sectionName == sectionName});
      if(!result){
      return res.status(404).json({ errors: "Unauthorized Access" });
      }

      var obj={};
      for(let i=0;i<attendance.length;i++){
        let { date,attendanceDetails } = attendance[i];
        let s = attendanceDetails.find((el)=>{return el.student == studentName});;
        obj[date] = s.status; 
      }
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