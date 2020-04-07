const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const config = require("config");
const jwt = require("jsonwebtoken");
const ClassFee = require('../../../models/Fees/ClassFee');

// @route   POST api/admin/createClassFee
// @desc    Creates Fee details for 
// @access  Public
router.post("/createClassFee",
 [
    check("sectionName", "Include Section name")
      .not()
      .isEmpty(),
    check("allFee", "Include All fee")
      .not()
      .isEmpty()  
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { sectionName, allFee }=req.body;
    res.send(sectionName, allFee);
    try {
    // See if Class Fee already exist
    let classFee = await ClassFee.find({ sectionName });
    if (classFee.length) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Class Fee for given constraints already exists" }] });
    }
    classfee = new ClassFee({ sectionName, allFee: allFee });
    await classFee.save();
    return res.send("Class fee added successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/admin/updateClassFee
// @desc    Updates a Class Fee
// @access  Public
router.post("/updateClassFee/:id",
[
  check("sectionName", "Include Section name")
    .not()
    .isEmpty(),
  check("allFee", "Include All fee")
    .not()
    .isEmpty()  
],
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { sectionName, allFee }=req.body;
  const { id } = req.params;

  try {
    let classfee = await ClassFee.findByIdAndUpdate({ id }, { sectionName, allFee: allFee });
    if (classfee) {
      return res.send("class fee updated successfully");
    } else {
      return res.send("No fee to be updated for given id");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/admin/deleteClassFee
// @desc    Deletes Class Fee for given id
// @access  Public
router.delete("/deleteClassFee/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // See if Fee Exists
    let classFee = await ClassFee.findById(id);
    if (classFee) {
      classFee.deleteOne();
      return res.send("class fee deleted successfully");
    } else {
      return res.send("No class fee to be deleted for given id");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/admin/readClassFee
// @desc    Read Class Fee with or without filter(s)
// @access  Public

router.get("/readClassFee", async (req, res) => {
  try {
    let qdata = req.query;

    // See if Attendance Exist
    let classFee = await ClassFee.find(qdata);
    if (classFee.length) {
      res.send(classFee);
    } else {
      return res.send("No class fee found for given constraints");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


module.exports = router;
