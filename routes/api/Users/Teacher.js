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



// @route   Read api/teachers/viewSectionAttendance 
// @desc    Gets Attendance for a given section
// @access  Public
router.get("/viewSectionAttendance/:sectionName/:month/:academicYear",
  authTeacher,
  async (req, res) => {
  const { sectionName,month,academicYear } = req.params;

  try {
    // Check validity if sectionName and month spelling and academicYear validness
    
    // Check Teacher Authority
    let teacher = await Teacher.findById(req.user.user.id);
    let result = teacher.sectionAccess.find((el)=>{return el.sectionName==sectionName});
    if(!result){
      return res.status(404).json({ errors: "Unauthorized Access" });
    }



    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    let attendancemod = await Attendance.find({sectionName});
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




// const router = require("express").Router();
// const bcrypt = require("bcryptjs");
// const { check, validationResult } = require("express-validator");
// const config = require("config");
// const jwt = require("jsonwebtoken");
// const Subject = require("../../../models/Subject/Subject");
// const Assignment = require("../../../models/Tasks/Assignment");
// const Homework = require("../../../models/Tasks/Homework");



// // HOMEWORK & ASSIGNMENT /////////////////////////////////////////

// // @route   POST api/admin/createAssignments
// // @desc    Creates an Assignment with express-validator implementation 
// // @access  Public
// router.post("/createAssignments",
//   [
//     check("subName", "Include Subject Name")
//       .not()
//       .isEmpty(),
//     check("assignmentGivenByTeacher", "Include Teacher Id")
//       .not()
//       .isEmpty(),
//     check("sectionName", "Include Section Name")
//       .not()
//       .isEmpty(),
//     check("assignmentDetails", "Include Assignment Details")
//       .not()
//       .isEmpty(),
//     check("assignedOn", "Include assigned on date")
//       .not()
//       .isEmpty(),
//     check("dueDate", "Include due date")
//       .not()
//       .isEmpty(),
//     check("assignmentDetails", "Include Assignment Details")
//       .not()
//       .isEmpty(),
//     check("assignedToStudents", "Include Assigned to Student")
//       .not()
//       .isEmpty()   
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const { subName,assignmentGivenByTeacher,sectionName,assignmentDetails,assignedOn,dueDate,assignedToStudents }=req.body;
//     try {
//     // See if Assignment Exists
//     let assignment = await Assignment.find({subName,assignmentGivenByTeacher,sectionName,assignmentDetails,assignedOn,dueDate});
//     if (assignment.length) {
//       return res
//         .status(400)
//         .json({ errors: [{ msg: "Assignment already exists" }] });
//     }
//     assignment = new Assignment({subName,assignmentGivenByTeacher,sectionName,assignmentDetails,assignedOn,dueDate,assignedToStudents});
//     await assignment.save();
//     return res.send("assignment added successfully");
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   POST api/admin/updateAssignments
// // @desc    Updates an Assignment with express-validator implementation
// // @access  Public
// router.post("/updateAssignments",
//   [
//     check("_id", "Include Assignment Id")
//       .not()
//       .isEmpty(),  
//     check("subName", "Include Subject Name")
//       .not()
//       .isEmpty(),
//     check("assignmentGivenByTeacher", "Include Teacher Id")
//       .not()
//       .isEmpty(),
//     check("sectionName", "Include Section Name")
//       .not()
//       .isEmpty(),
//     check("assignmentDetails", "Include Assignment Details")
//       .not()
//       .isEmpty(),
//     check("assignedOn", "Include assigned on date")
//       .not()
//       .isEmpty(),
//     check("dueDate", "Include due date")
//       .not()
//       .isEmpty(),
//     check("assignedToStudents", "Include Assigned to Student")
//       .not()
//       .isEmpty()   
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//   const { 
//     _id,
//     subName,
//     assignmentGivenByTeacher,
//     sectionName,
//     assignmentDetails,
//     assignedOn,
//     dueDate,
//     assignedToStudents 
//   } = req.body;
//   try {
//     let assignment = await Assignment.findByIdAndUpdate({ _id }, {subName,assignmentGivenByTeacher,sectionName,assignmentDetails,assignedOn,dueDate,assignedToStudents});
//     if (assignment) {
//       return res.send("assignment updated successfully");
//     } else {
//       console.log(assignment);
//       return res.send("No assignment to be updated for given id");
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   DELETE api/admin/deleteAssignments
// // @desc    Deletes an Assignment based on id
// // @access  Public
// router.delete("/deleteAssignments/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     // See if Assignment Exists
//     let assignment = await Assignment.findById(id);
//     if (assignment) {
//       assignment.deleteOne();
//       return res.send("assignment deleted successfully");
//     } else {
//       return res.send(
//         "No assignment to be deleted for given id"
//       );
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   GET api/admin/readAssignments
// // @desc    Read Assignments with or without filter(s)
// // @access  Public

// router.get("/readAssignments", async (req, res) => {
//   try {
//     let qdata = req.query;

//     // See if Assignments Exist
//     let assignments = await Assignment.find(qdata).populate('assignmentGivenByTeacher');
//     if (assignments.length) {
//       res.send(assignments);
//     } else {
//       return res.send("No assignments found for given constraints");
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // Make route /subjectsAssignmentForStudent/:studentId



// // @route   POST api/admin/createHomeworks
// // @desc    Creates a Homework
// // @access  Public
// router.post("/createHomeworks",
//  [
//     check("subName", "Include Subject Name")
//       .not()
//       .isEmpty(),
//     check("homeworkGivenByTeacher", "Include Teacher Id")
//       .not()
//       .isEmpty(),
//     check("sectionName", "Include Section Name")
//       .not()
//       .isEmpty(),
//     check("homeworkDetails", "Include Homework Details")
//       .not()
//       .isEmpty(),
//     check("dueDate", "Include due date")
//       .not()
//       .isEmpty(),
//     check("assignedToStudents", "Include Assigned to Student")
//       .not()
//       .isEmpty()   
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     const { subName,homeworkGivenByTeacher,sectionName,homeworkDetails,dueDate,assignedToStudents }=req.body;
//     try {
//     // See if Homework Exists
//     let homework = await Homework.find({ subName,homeworkGivenByTeacher,sectionName,homeworkDetails,dueDate });
//     if (homework.length) {
//       return res
//         .status(400)
//         .json({ errors: [{ msg: "Homework already exists" }] });
//     }
//     homework = new Homework({ subName,homeworkGivenByTeacher,sectionName,homeworkDetails,dueDate,assignedToStudents });
//     await homework.save();
//     return res.send("homework added successfully");
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   POST api/admin/updateHomeworks
// // @desc    Updates a Homework for a given day and subject
// // @access  Public
// router.post("/updateHomeworks",
//   [
//     check("_id", "Include Homework Id")
//       .not()
//       .isEmpty(),  
//     check("subName", "Include Subject Name")
//       .not()
//       .isEmpty(),
//     check("homeworkGivenByTeacher", "Include Teacher Id")
//       .not()
//       .isEmpty(),
//     check("sectionName", "Include Section Name")
//       .not()
//       .isEmpty(),
//     check("homeworkDetails", "Include Homework Details")
//       .not()
//       .isEmpty(),
//     check("dueDate", "Include due date")
//       .not()
//       .isEmpty(),
//     check("assignedToStudents", "Include Assigned to Student")
//       .not()
//       .isEmpty()   
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//   const { 
//     _id,
//     subName,
//     homeworkGivenByTeacher,
//     sectionName,
//     homeworkDetails,
//     assignedOn,
//     dueDate,
//     assignedToStudents 
//   } = req.body;
//   try {
//     let homework = await Homework.findByIdAndUpdate({ _id }, { subName,homeworkGivenByTeacher,sectionName,homeworkDetails,assignedOn,dueDate,assignedToStudents });
//     if (homework) {
//       return res.send("homework updated successfully");
//     } else {
//       return res.send("No homework to be updated for given id");
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   DELETE api/admin/deleteAssignments
// // @desc    Deletes a Homework for given id
// // @access  Public
// router.delete("/deleteHomeworks/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     // See if Homework Exists
//     let homework = await Homework.findById(id);
//     if (homework) {
//       homework.deleteOne();
//       return res.send("homework deleted successfully");
//     } else {
//       return res.send("No homework to be deleted for given id");
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // @route   GET api/admin/readAssignments
// // @desc    Read Homework with or without filter(s)
// // @access  Public

// router.get("/readHomeworks", async (req, res) => {
//   try {
//     // query params != mongoose fields , id casting handle, selected params
//     let qdata = req.query;

//     // See if Homework Exist
//     let homeworks = await Homework.find(qdata).populate('homeworkGivenByTeacher');
//     if (homeworks.length) {
//       res.send(homeworks);
//     } else {
//       return res.send("No homework found for given constraints");
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// router.get("/subjectsHomeWorkForStudent/:studentId", async (req, res) => {
//   try {
//     // Check if the student exist
//     const { studentId } = req.params;
//     let homeworks = await Homework.find({"assignedToStudents.student":studentId})
//     .populate('homeworkGivenByTeacher')
//     .populate('sectionName')
//     .populate('subName');
//     console.log(homeworks);
//     if (homeworks.length) {
//       let arr = [];
//       homeworks.forEach(homework => {
//         let {subName,sectionName,homeworkGivenByTeacher,homeworkDetails,dueDate,assignedToStudents} = homework;
//         let s = assignedToStudents.find(el => {return el.student == studentId});
//         arr.push({subName: homework.subName.name,sectionName:sectionName.name,homeworkGivenByTeacher:homeworkGivenByTeacher.name,
//           homeworkDetails:homeworkDetails,dueDate:dueDate,status:s.status});
//       });
//       return res.send(arr);
//     } else {
//       return res.send("No homework found for given student");
//     }
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

module.exports = router;