const router = require("express").Router(),
      mongoose            = require('mongoose'),
      Teacher             = require("../../../models/Users/Teacher");


// @route		GET api/teacher
// @desc		Test Route
// @access		Public
router.get("/", (req, res) => {
  res.send("Teacher");
});

// CREATE
router.post("/api/admin/createTeacher", function(req, res){
    
  let name = req.body.name;
  let fatherOrSpouseName = req.body.fatherOrSpouseName;
  let address = req.body.address;
  let dob = req.body.dob;
  let aadharNumber = req.body.aadharNumber;
  let accountNumber = req.body.accountNumber;
  let photo = req.body.photo;
  let email = req.body.email;
  let dateOfJoining = req.body.dateOfJoining;
  let password = req.body.password;
  let positionOfResponsibility = req.body.positionOfResponsibility;
  let education = req.body.education;
  let salary = req.body.salary;
  let SSSMID = req.body.SSSMID;

  let newTeacher = {
      name: name,
      fatherOrSpouseName: fatherOrSpouseName,
      address: address,
      dob: dob,
      aadharNumber: aadharNumber,
      accountNumber: accountNumber,
      photo: photo,
      email: email,
      dateOfJoining: dateOfJoining,
      password: password,
      positionOfResponsibility: positionOfResponsibility,
      education: education,
      salary: salary,
      SSSMID: SSSMID
  };
  
  Teacher.create(newTeacher, function(err, newTeacher){
      if(err)
      {
          console.log(err);
          req.flash("error",err.message);
      }
      else
      {
          console.log(newTeacher);
          res.redirect("/");
      }    
  });
});

// SHOW All
router.get("/api/admin/viewTeacher", function(req, res) {
  Teacher.find({},function(err, allTeacher){
    if(err)
    {
        console.log(err);
        req.flash("error",err.message);
    }
    else
    {
      console.log(allTeacher);
    }
 });
});

// SHOW Single
router.get("/api/admin/viewTeacher/:id", function(req, res) {
  Teacher.findById(req.params.id,function(err, foundTeacher){
    if(err)
    {
        console.log(err);
        req.flash("error",err.message);
    }
    else
    {
      console.log(foundTeacher);
    }
 });
});

// UPDATE
router.put("/api/admin/updateTeacher/:id", function(req,res){
  
  let name = req.body.name;
  let fatherOrSpouseName = req.body.fatherOrSpouseName;
  let address = req.body.address;
  let dob = req.body.dob;
  let aadharNumber = req.body.aadharNumber;
  let accountNumber = req.body.accountNumber;
  let photo = req.body.photo;
  let email = req.body.email;
  let dateOfJoining = req.body.dateOfJoining;
  let password = req.body.password;
  let positionOfResponsibility = req.body.positionOfResponsibility;
  let education = req.body.education;
  let salary = req.body.salary;
  let SSSMID = req.body.SSSMID;

  let updateTeacher = {
      name: name,
      fatherOrSpouseName: fatherOrSpouseName,
      address: address,
      dob: dob,
      aadharNumber: aadharNumber,
      accountNumber: accountNumber,
      photo: photo,
      email: email,
      dateOfJoining: dateOfJoining,
      password: password,
      positionOfResponsibility: positionOfResponsibility,
      education: education,
      salary: salary,
      SSSMID: SSSMID
  };

  Teacher.findByIdAndUpdate(req.params.id, updateTeacher, function(err, updatedTeacher){
      if(err){
          console.log(err);
          req.flash("error",err.message);
          res.redirect("/");
      }
      else{
          console.log(updatedTeacher);
      }
  });
});

// DELETE
router.delete("/api/admin/deleteTeacher/:id", function(req,res){
  Teacher.findByIdAndRemove(req.params.id,function(err){
      if(err){
          console.log(err);
          req.flash("error",err.message);
          res.redirect("/teachers");
      }
      else {
          console.log("Teacher deleted");
      }
  });
});

module.exports = router;
