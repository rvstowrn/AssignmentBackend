const router = require("express").Router(),
      mongoose            = require('mongoose'),
      Student             = require("../../../models/Users/Student");
const authStudent = require("../../../middleware/authStudent");      
const Attendance = require("../../../models/Attendance/Attendance");

// @route		GET api/student
// @desc		Test Route
// @access		Public
router.get("/", (req, res) => {
  res.send("Student");
});


// @route   Read api/students/viewAttendance
// @desc    Gets Attendance for a given student
// @access  Public
router.get("/viewAttendance",
  authStudent, 
  async (req, res) => {

  try {
    // See if Attendance Exists
    let student = await Student.findById(req.user.user.id); 
    let sectionName = student.sectionName;
    let attendance = await Attendance.find({sectionName:sectionName});
    if (attendance) {
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