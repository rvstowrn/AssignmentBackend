const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const config = require("config");
const jwt = require("jsonwebtoken");
const Fee = require('../../../models/Fees/Fee');

// @route   POST api/admin/createFee
// @desc    Creates Fee details for 
// @access  Public
router.post("/createFee",
 [
    check("type", "Include Fee type")
      .not()
      .isEmpty(),
    check("frequency", "Include Frequency")
      .not()
      .isEmpty()  
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { type, frequency, status }=req.body;
    try {
    // See if Fee already exist
    let fee = await Fee.find({ type, frequency });
    if (fee.length) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Fee for given constraints already exists" }] });
    }
    fee = new Fee({ type, frequency, status });
    await fee.save();
    return res.send("fee added successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/admin/updateFee
// @desc    Updates a Fee
// @access  Public
router.post("/updateFee/:id",
[
  check("type", "Include Fee type")
    .not()
    .isEmpty(),
  check("frequency", "Include Frequency")
    .not()
    .isEmpty()  
],
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { type, frequency, status }=req.body;
  const { id } = req.params;

  try {
    let fee = await Fee.findByIdAndUpdate({ id }, { type, frequency, status });
    if (fee) {
      return res.send("fee updated successfully");
    } else {
      return res.send("No fee to be updated for given id");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/admin/deleteFee
// @desc    Deletes Fee for given id
// @access  Public
router.delete("/deleteFee/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // See if Fee Exists
    let fee = await Fee.findById(id);
    if (fee) {
      fee.deleteOne();
      return res.send("fee deleted successfully");
    } else {
      return res.send("No fee to be deleted for given id");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/admin/readFee
// @desc    Read Fee with or without filter(s)
// @access  Public

router.get("/readFee", async (req, res) => {
  try {
    let qdata = req.query;

    // See if Attendance Exist
    let fee = await Fee.find(qdata);
    if (fee.length) {
      res.send(fee);
    } else {
      return res.send("No fee found for given constraints");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


module.exports = router;
