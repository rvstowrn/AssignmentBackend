// const router = require("express").Router(),
//       mongoose            = require('mongoose'),
//       Teacher             = require("../../../models/Users/Teacher");


// // @route		GET api/teacher
// // @desc		Test Route
// // @access		Public
// router.get("/", (req, res) => {
//   res.send("Teacher");
// });

// // CREATE
// router.post("/api/admin/createTeacher", function(req, res){
    
//   let name = req.body.name;
//   let fatherOrSpouseName = req.body.fatherOrSpouseName;
//   let address = req.body.address;
//   let dob = req.body.dob;
//   let aadharNumber = req.body.aadharNumber;
//   let accountNumber = req.body.accountNumber;
//   let photo = req.body.photo;
//   let email = req.body.email;
//   let dateOfJoining = req.body.dateOfJoining;
//   let password = req.body.password;
//   let positionOfResponsibility = req.body.positionOfResponsibility;
//   let education = req.body.education;
//   let salary = req.body.salary;
//   let SSSMID = req.body.SSSMID;

//   let newTeacher = {
//       name: name,
//       fatherOrSpouseName: fatherOrSpouseName,
//       address: address,
//       dob: dob,
//       aadharNumber: aadharNumber,
//       accountNumber: accountNumber,
//       photo: photo,
//       email: email,
//       dateOfJoining: dateOfJoining,
//       password: password,
//       positionOfResponsibility: positionOfResponsibility,
//       education: education,
//       salary: salary,
//       SSSMID: SSSMID
//   };
  
//   Teacher.create(newTeacher, function(err, newTeacher){
//       if(err)
//       {
//           console.log(err);
//           req.flash("error",err.message);
//       }
//       else
//       {
//           console.log(newTeacher);
//           res.redirect("/");
//       }    
//   });
// });

// // SHOW All
// router.get("/api/admin/viewTeacher", function(req, res) {
//   Teacher.find({},function(err, allTeacher){
//     if(err)
//     {
//         console.log(err);
//         req.flash("error",err.message);
//     }
//     else
//     {
//       console.log(allTeacher);
//     }
//  });
// });

// // SHOW Single
// router.get("/api/admin/viewTeacher/:id", function(req, res) {
//   Teacher.findById(req.params.id,function(err, foundTeacher){
//     if(err)
//     {
//         console.log(err);
//         req.flash("error",err.message);
//     }
//     else
//     {
//       console.log(foundTeacher);
//     }
//  });
// });

// // UPDATE
// router.put("/api/admin/updateTeacher/:id", function(req,res){
  
//   let name = req.body.name;
//   let fatherOrSpouseName = req.body.fatherOrSpouseName;
//   let address = req.body.address;
//   let dob = req.body.dob;
//   let aadharNumber = req.body.aadharNumber;
//   let accountNumber = req.body.accountNumber;
//   let photo = req.body.photo;
//   let email = req.body.email;
//   let dateOfJoining = req.body.dateOfJoining;
//   let password = req.body.password;
//   let positionOfResponsibility = req.body.positionOfResponsibility;
//   let education = req.body.education;
//   let salary = req.body.salary;
//   let SSSMID = req.body.SSSMID;

//   let updateTeacher = {
//       name: name,
//       fatherOrSpouseName: fatherOrSpouseName,
//       address: address,
//       dob: dob,
//       aadharNumber: aadharNumber,
//       accountNumber: accountNumber,
//       photo: photo,
//       email: email,
//       dateOfJoining: dateOfJoining,
//       password: password,
//       positionOfResponsibility: positionOfResponsibility,
//       education: education,
//       salary: salary,
//       SSSMID: SSSMID
//   };

//   Teacher.findByIdAndUpdate(req.params.id, updateTeacher, function(err, updatedTeacher){
//       if(err){
//           console.log(err);
//           req.flash("error",err.message);
//           res.redirect("/");
//       }
//       else{
//           console.log(updatedTeacher);
//       }
//   });
// });

// // DELETE
// router.delete("/api/admin/deleteTeacher/:id", function(req,res){
//   Teacher.findByIdAndRemove(req.params.id,function(err){
//       if(err){
//           console.log(err);
//           req.flash("error",err.message);
//           res.redirect("/teachers");
//       }
//       else {
//           console.log("Teacher deleted");
//       }
//   });
// });

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


module.exports = router;
