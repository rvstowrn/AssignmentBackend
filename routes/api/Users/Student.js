const router = require("express").Router(),
      mongoose            = require('mongoose'),
      Student             = require("../../../models/Users/Student");
const Attendance = require("../../../models/Attendance/Attendance");

// console.log(mongoose);


// @route		GET api/student
// @desc		Test Route
// @access		Public
router.get("/", (req, res) => {
  res.send("Student");
});

// // CREATE
// router.post("/api/admin/createStudent", function(req, res){
    
//   let name = req.body.name;
//   let Class = req.body.Class;
//   let fatherName = req.body.fatherName;
//   let motherName = req.body.motherName;
//   let address = req.body.address;
//   let dob = req.body.dob;
//   let aadharNumber = req.body.aadharNumber;
//   let accountNumber = req.body.accountNumber;
//   let photo = req.body.photo;
//   let enrollmentNumber = req.body.enrollmentNumber;
//   let rollNumber = req.body.rollNumber;
//   let password = req.body.password;
//   let SSSMID = req.body.SSSMID;

//   let newStudent = {
//       name: name,
//       class: Class,
//       fatherName: fatherName,
//       motherName: motherName,
//       address: address,
//       dob: dob,
//       aadharNumber: aadharNumber,
//       accountNumber: accountNumber,
//       photo: photo,
//       enrollmentNumber: enrollmentNumber,
//       rollNumber: rollNumber,
//       password: password,
//       SSSMID: SSSMID
//   };
  
//   Student.create(newStudent, function(err, newStudent){
//       if(err)
//       {
//           console.log(err);
//           req.flash("error",err.message);
//       }
//       else
//       {
//           console.log(newStudent);
//           res.redirect("/");
//       }    
//   });
// });

// // SHOW All
// router.get("/api/admin/viewStudent", function(req, res) {
//   Student.find({},function(err, allStudent){
//     if(err)
//     {
//         console.log(err);
//         req.flash("error",err.message);
//     }
//     else
//     {
//       console.log(allStudent);
//     }
//  });
// });

// // SHOW Single
// router.get("/api/admin/viewStudent/:id", function(req, res) {
//   Student.findById(req.params.id,function(err, foundStudent){
//     if(err)
//     {
//         console.log(err);
//         req.flash("error",err.message);
//     }
//     else
//     {
//       console.log(foundStudent);
//     }
//  });
// });

// // UPDATE
// router.put("/api/admin/updateStudent/:id", function(req,res){
  
//   let name = req.body.name;
//   let Class = req.body.Class;
//   let fatherName = req.body.fatherName;
//   let motherName = req.body.motherName;
//   let address = req.body.address;
//   let dob = req.body.dob;
//   let aadharNumber = req.body.aadharNumber;
//   let accountNumber = req.body.accountNumber;
//   let photo = req.body.photo;
//   let enrollmentNumber = req.body.enrollmentNumber;
//   let rollNumber = req.body.rollNumber;
//   let password = req.body.password;
//   let SSSMID = req.body.SSSMID;

//   let updateStudent = {
//       name: name,
//       class: Class,
//       fatherName: fatherName,
//       motherName: motherName,
//       address: address,
//       dob: dob,
//       aadharNumber: aadharNumber,
//       accountNumber: accountNumber,
//       photo: photo,
//       enrollmentNumber: enrollmentNumber,
//       rollNumber: rollNumber,
//       password: password,
//       SSSMID: SSSMID
//   };
  

//   Student.findByIdAndUpdate(req.params.id, updateStudent, function(err, updatedStudent){
//       if(err){
//           console.log(err);
//           req.flash("error",err.message);
//           res.redirect("/");
//       }
//       else{
//           console.log(updatedStudent);
//       }
//   });
// });

// // DELETE
// router.delete("/api/admin/deleteStudent/:id", function(req,res){
//   Student.findByIdAndRemove(req.params.id,function(err){
//       if(err){
//           console.log(err);
//           req.flash("error",err.message);
//           res.redirect("/student");
//       }
//       else {
//           console.log("Student deleted");
//           res.redirect("/students");
//       }
//   });
// });


router.get("/readAttendance/:id", async (req, res) => {
  try {
    let studentId = req.params.id;

	let agg=await Attendance.aggregate([
	   { $match: { date: "2019-03-25T00:00:00.000+00:00" } },
	   { $group: { _id: "$cust_id" } }
	])




    // See if Attendance Exist
    // let agg = await Attendance.aggregate([{ $match: {"attendanceDetails": {$elemMatch: { student: studentId } }}}]);
    // [{ $match: {"attendanceDetails": {$elemMatch: { student: studentId } }}}]
    // let agg = await Attendance.aggregate([{$where:{"date":  "2019-03-25T00:00:00.000Z"}}]);
    // let studAttendance = await Attendance.countDocuments({"attendanceDetails": {$elemMatch: { student: studentId } }});
    console.log(agg);
    res.send('worked');
}catch(e){
	console.log(e);
    res.send('error');

}
});






















module.exports = router;
