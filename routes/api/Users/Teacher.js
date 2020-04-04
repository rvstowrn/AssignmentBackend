const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const Attendance = require("../../../models/Attendance/Attendance");
const Teacher = require("../../../models/Users/Teacher");
const Student = require("../../../models/Users/Student");
const Section = require("../../../models/Section/Section");
const authTeacher = require("../../../middleware/authTeacher");


// @route   POST api/teachers/createAttendance
// @desc    Creates Attendance details 
// @access  Teacher
router.post("/createAttendance",
 [
    check("sectionName", "Include Section Name")
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
    const { sectionName,date,attendanceDetails }=req.body;
    try {
    // Check if section,teacher and students exist with student belonging to given section       
    // Check Teacher Authority
    let teacher = await Teacher.findById(req.user.user.id);
    let result = teacher.sectionAccess.find((el)=>{return el.sectionName==sectionName});
    if(!result){
      return res.status(404).json({ errors: "Unauthorized Access" });
    }

    // See if Attendance already exist
    let attendance = await Attendance.find({ sectionName ,date });
    if (attendance.length) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Attendance already exist for given section and date" }] });
    }
    let teacherName = teacher._id;
    attendance = new Attendance({ sectionName,teacherName,date,attendanceDetails });
    await attendance.save();
    return res.send("attendance added successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/teacher/updateAttendance
// @desc    Updates an Attendance for a given day and section
// @access  Teacher
router.post("/updateAttendance",
  [
    check("_id", "Include Attendance Id")
      .not()
      .isEmpty(),  
    check("sectionName", "Include Section Name")
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
    date,
    attendanceDetails,
  } = req.body;
  try {
    // Check if section,teacher and students exist with student belonging to given section       
    // Do something to stop more docs in case of update param date and section already exist 
    
    // Check Teacher Authority
    let teacher = await Teacher.findById(req.user.user.id);
    let result = teacher.sectionAccess.find((el)=>{return el.sectionName==sectionName});
    if(!result){
      return res.status(404).json({ errors: "Unauthorized Access" });
    }
    let teacherName = teacher._id;
    let attendance = await Attendance.findByIdAndUpdate({ _id }, { sectionName,teacherName,date,attendanceDetails });
    if (attendance) {
      return res.send("attendance updated successfully");
    } else {
      return res.send("No attendance found with given id");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/teachers/deleteAttendance
// @desc    Deletes Attendance for given id
// @access  Teacher
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
      return res.send("No attendance found with given id");
    }
    
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/admin/readAttendance
// @desc    Read Attendance with or without filter(s)
// @access  Teacher

router.get("/readAttendance",authTeacher,
 async (req, res) => {
  try {
    
    //Only allow teacher to read attendance according to sectionAccess and only allow selected query params

    let qdata = req.query;

    // See if Attendance Exist
    let attendance = await Attendance.find(qdata).populate('teacherName');
    if (attendance.length) {
      res.send({attendances:attendance});
    } else {
      return res.send("No attendance found for given params");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


// // @route   Read api/admin/viewSectionAttendance/:id
// // @desc    Gets Attendance for a given section
// // @access  Public
// router.get("/viewSectionAttendance/:sectionName",
//   // authTeacher, 
//   async (req, res) => {
//   const { sectionName } = req.params;

//   try {
//     // See if Attendance Exists
//     let attendance = await Attendance.find({sectionName:sectionName});
//     if (attendance) {
//       // let teacher = await Teacher.findById(req.user.user.id);
//       // let result = teacher.sectionAccess.find((el)=>{return el.sectionName == sectionName});
//       // if(!result){
//       // return res.status(404).json({ errors: "Unauthorized Access" });
//       // }

//       var obj={};
//       for(let i=0;i<attendance.length;i++){
//         let {date, attendanceDetails} = attendance[i];
//         obj[date] = {};
//         for(let j=0;j<attendanceDetails.length;j++){
//           obj[date][attendanceDetails[j].student] = attendanceDetails[j].status;
//         }
//       }
//       return res.send(obj);
//     } else {
//       return res.send("No attendance to be shown");
//     }
    
    
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });



// // @route   Read api/admin/viewStudentAttendance/:studentName
// // @desc    Gets Attendance for a given student and dates
// // @access  Public
// router.get("/viewStudentAttendance/",
//   authTeacher, 
//   async (req, res) => {

//   const { studentName, dates } = req.body;

//   try {
//     // See if Attendance Exists
//     let student = await Student.findById(studentName); 
//     let sectionName = student.sectionName;
//     let attendance = await Attendance.find({sectionName:sectionName,date:{$in:dates}});
//     if (attendance) {
//       let teacher = await Teacher.findById(req.user.user.id);
//       let result = teacher.sectionAccess.find((el)=>{return el.sectionName == sectionName});
//       if(!result){
//       return res.status(404).json({ errors: "Unauthorized Access" });
//       }

//       var obj={};
//       for(let i=0;i<attendance.length;i++){
//         let { date,attendanceDetails } = attendance[i];
//         let s = attendanceDetails.find((el)=>{return el.student == studentName});;
//         obj[date] = s.status; 
//       }
//       return res.send(obj);
//     } else {
//       return res.send("No attendance to be shown");
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });


module.exports = router;