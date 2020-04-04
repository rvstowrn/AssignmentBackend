const router      = require("express").Router();
const mongoose    = require('mongoose');
const authStudent = require("../../../middleware/authStudent");      
const Student     = require("../../../models/Users/Student");
const Attendance  = require("../../../models/Attendance/Attendance");
const Timetable   = require("../../../models/Timetables/Timetables");

// @route		GET api/student
// @desc		Test Route
// @access		Public
router.get("/", (req, res) => {
  res.send("Student");
});

// @route   Read api/students/viewAttendanceOfAcademicYear/:academicYear
// @desc    Gets Attendance for a given student and academic year
// @access  Student
router.get("/viewAttendanceOfAcademicYear/:academicYear",
  authStudent,
  async (req, res) => {
  
  const studentId = req.user.user.id;	
  const { academicYear } = req.params;

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


// @route   Read api/students/subjectsAssignmentForStudent
// @desc    Gets asignments for a given student and academic year
// @access  Student
router.get("/subjectsAssignmentForStudent",authStudent, async (req, res) => {
  try {
    // Check if the student exist
    const studentId = req.user.user.id;
    let assignments = await Assignment.find({"assignedToStudents.student":studentId})
    .populate('assignmentGivenByTeacher')
    .populate('sectionName')
    .populate('subName');
    if (assignments.length) {
      let arr = [];
      assignments.forEach(assignment => {
        let {subName,sectionName,assignmentGivenByTeacher,assignmentDetails,dueDate,assignedToStudents} = assignment;
        let s = assignedToStudents.find(el => {return el.student == studentId});
        arr.push({subName: subName.name,sectionName:sectionName.name,assignmentGivenByTeacher:assignmentGivenByTeacher.name,
          assignmentDetails:assignmentDetails,dueDate:dueDate,status:s.status,
          marks:(s.marks || -1),totalMarks:(s.totalMarks || -1)});
      });
      return res.send(arr);
    } else {
      return res.send("No homework found for given student");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});



// @route   Read api/students/subjectsHomeworkForStudent
// @desc    Gets homework for a given student and academic year
// @access  Student
router.get("/subjectsHomeWorkForStudent",
  authStudent,	
  async (req, res) => {
  try {
    // Check if the student exist
  	const studentId = req.user.user.id;	 
    let homeworks = await Homework.find({"assignedToStudents.student":studentId})
    .populate('homeworkGivenByTeacher')
    .populate('sectionName')
    .populate('subName');
    if (homeworks.length) {
      let arr = [];
      homeworks.forEach(homework => {
        let {subName,sectionName,homeworkGivenByTeacher,homeworkDetails,dueDate,assignedToStudents} = homework;
        let s = assignedToStudents.find(el => {return el.student == studentId});
        arr.push({subName: homework.subName.name,sectionName:sectionName.name,homeworkGivenByTeacher:homeworkGivenByTeacher.name,
          homeworkDetails:homeworkDetails,dueDate:dueDate,status:s.status});
      });
      return res.send(arr);
    } else {
      return res.send("No homework found for given student");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});



router.get("/timetableForStudents",
  authStudent,
  async (req, res) => {
  try {
    // check if student exists
    const studentId = req.user.user.id;
    var student = await Student.findById(studentId);
    let timetable = await Timetable.findOne({sectionName:student.sectionName}).populate('subName');
    if (timetable) {
      var arr=[];
      timetable.timetableDetails.forEach(detail=>{
        var obj={};
        obj['dayName']=detail.dayName;
        obj['slots']=[]; 
        detail.slots.forEach(slot=>{
          obx={};
          obx['sectionName']=timetable.sectionName;
          obx['subName']=slot.subName.name;
          obx['startTime']=slot.startTime;
          obx['endTime']=slot.endTime;
          obj['slots'].push(obx);
        });
        arr.push(obj);
      });
      return res.send(arr);
    } else {
      return res.send("Timetable not set");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


module.exports = router;