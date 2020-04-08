const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const config = require("config");
const jwt = require("jsonwebtoken");
const StudentFee = require('../../../models/Fees/StudentFee');

// @route   POST api/admin/createStudentFee
// @desc    Creates Student Fee details for 
// @access  Public
router.post("/createStudentFee",
 [
    check("studentName", "Include Student name")
      .not()
      .isEmpty(),
    check("monthYear", "Include Month Year")
      .not()
      .isEmpty(),
    check("admissionNumber", "Include Admission Number")
      .not()
      .isEmpty(),
    check("allFee", "Include Fee structure")
      .not()
      .isEmpty()   
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { studentName, monthYear, admissionNumber, allFee, feeListings }=req.body;
    
    try { 
    // See if Fee already exist
    let fee = await StudentFee.find({ studentName });
    if (fee.length) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Student Fee for given constraints already exists" }] });
    }
    fee = new StudentFee({ studentName, monthYear, admissionNumber, allFee, feeListings });
    await fee.save();
    return res.send("Student fee added successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/admin/updateStudentFee
// @desc    Updates a Student Fee
// @access  Public
router.post("/updateStudentFee/:id",
[
  check("studentName", "Include Student name")
    .not()
    .isEmpty(),
  check("monthYear", "Include Month Year")
    .not()
    .isEmpty(),
  check("admissionNumber", "Include Admission Number")
    .not()
    .isEmpty(),
  check("allFee", "Include Fee structure")
    .not()
    .isEmpty()   
],
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { studentName, monthYear, admissionNumber, allFee, feeListings }=req.body;
  const { id } = req.params;

  try {
    let fee = await StudentFee.findByIdAndUpdate({ id }, { studentName, monthYear, admissionNumber, allFee, feeListings });
    if (fee) {
      return res.send("student fee updated successfully");
    } else {
      return res.send("No fee to be updated for given id");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/admin/deleteStudentFee
// @desc    Deletes Student Fee for given id
// @access  Public
router.delete("/deleteStudentFee/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // See if Fee Exists
    let classFee = await StudentFee.findById(id);
    if (classFee) {
      classFee.deleteOne();
      return res.send("fee deleted successfully");
    } else {
      return res.send("No class fee to be deleted for given id");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/admin/readStudentFee
// @desc    Read Student Fee with or without filter(s)
// @access  Public

router.get("/readStudentFee", async (req, res) => {
  try {
    let qdata = req.query;
    console.log("asds");
    // See if Student Fee Exist
    let studentFee = await StudentFee.find(qdata).populate("allFee.fee").populate("studentName").populate("feeListings.fee");
    if (studentFee.length) {
      res.send(studentFee);
    } else {
      return res.send("No student fee found for given constraints");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/readStudentFee/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // See if Student Fee Exist
    let studentFee = await StudentFee.find({ studentName: id }).populate("allFee.fee").populate("studentName").populate("feeListings.fee");
    if (studentFee.length) {
      res.send(studentFee);
    } else {
      return res.send("No student fee found for given constraints");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


module.exports = router;
